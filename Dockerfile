FROM ghcr.io/sdr-enthusiasts/docker-baseimage:python

RUN set -x && \
# define packages needed for installation and general management of the container:
    TEMP_PACKAGES=() && \
    KEPT_PACKAGES=() && \
    KEPT_PIP3_PACKAGES=() && \
    KEPT_RUBY_PACKAGES=() && \
#
    TEMP_PACKAGES+=(pkg-config) && \
    TEMP_PACKAGES+=(git) && \
    TEMP_PACKAGES+=(gcc) && \
    TEMP_PACKAGES+=(python3-dev) && \
    TEMP_PACKAGES+=(python3-pip) && \
    TEMP_PACKAGES+=(pkg-config) && \
#
    KEPT_PACKAGES+=(unzip) && \
    KEPT_PACKAGES+=(psmisc) && \
    KEPT_PACKAGES+=(procps nano) && \
    KEPT_PACKAGES+=(python3-numpy) && \
    KEPT_PACKAGES+=(python3-pandas) && \
    KEPT_PACKAGES+=(python3-dateutil) && \
    KEPT_PACKAGES+=(jq) && \
    KEPT_PACKAGES+=(gnuplot-nox) && \
    KEPT_PACKAGES+=(lighttpd) && \
    KEPT_PACKAGES+=(perl) && \
    KEPT_PACKAGES+=(iputils-ping) && \
    KEPT_PACKAGES+=(php-cgi) && \
#
    KEPT_PIP3_PACKAGES+=(tzlocal) && \
    KEPT_PIP3_PACKAGES+=(discord-webhook==1.0.0) && \
#    KEPT_PIP3_PACKAGES+=(discord-webhook) && \
    KEPT_PIP3_PACKAGES+=(requests) && \
    KEPT_PIP3_PACKAGES+=(geopy) && \
#
#
# Install all the apt and pip3 packages:
    apt-get update -q && \
# The baseimage carries the packages it was built with; take Debian's security
# updates since then too.
    apt-get upgrade -q -y -o Dpkg::Options::="--force-confold" && \
    apt-get install -q -o APT::Autoremove::RecommendsImportant=0 -o APT::Autoremove::SuggestsImportant=0 -o Dpkg::Options::="--force-confold" -y --no-install-recommends  --no-install-suggests ${TEMP_PACKAGES[@]} ${KEPT_PACKAGES[@]} && \
    pip3 install --break-system-packages --no-cache-dir ${KEPT_PIP3_PACKAGES[@]} && \
#
# Do this here while we still have git installed:
    git config --global advice.detachedHead false && \
    echo "main_($(git ls-remote https://github.com/kx1t/docker-planefence HEAD | awk '{ print substr($1,1,7)}'))_$(date +%y-%m-%d-%T%Z)" > /root/.buildtime && \
# Clean up
    echo Uninstalling $TEMP_PACKAGES && \
    apt-get remove -y -q ${TEMP_PACKAGES[@]} && \
    apt-get autoremove -q -o APT::Autoremove::RecommendsImportant=0 -o APT::Autoremove::SuggestsImportant=0 -y && \
    apt-get clean -y -q && \
    rm -rf \
      /src/* \
      /tmp/* \
      /var/lib/apt/lists/* \
      /.dockerenv \
      /git
#
COPY rootfs/ /
#
COPY ATTRIBUTION.md /usr/share/planefence/stage/attribution.txt
#
RUN set -x && \
#
#
# Install Planefence (it was copied in with /rootfs, so this is
# mainly moving files to the correct location and creating symlinks):
    chmod a+x /usr/share/planefence/*.sh /usr/share/planefence/*.py /usr/share/planefence/*.pl /etc/services.d/planefence/run && \
# s6-overlay v3, in the current baseimage, ships with-contenv as
# /command/with-contenv, and every startup script here names the v2 path.
# It also stops the container if any cont-init script cannot run.
    ln -sf /command/with-contenv /usr/bin/with-contenv && \
    chmod a+x /etc/cont-init.d/* /etc/services.d/*/run && \
    ln -s /usr/share/socket30003/socket30003.cfg /usr/share/planefence/socket30003.cfg && \
    ln -s /usr/share/planefence/config_tweeting.sh /root/config_tweeting.sh && \
    curl --compressed --fail -s -L -o /usr/share/planefence/airlinecodes.txt https://raw.githubusercontent.com/kx1t/planefence-airlinecodes/main/airlinecodes.txt && \
    curl --compressed --fail -s -L -o /usr/share/planefence/stage/Silhouettes.zip https://github.com/rikgale/VRSOperatorFlags/raw/main/Silhouettes.zip && \
    curl --compressed --fail -s -L -o /usr/share/planefence/stage/OperatorFlags.zip https://github.com/rikgale/VRSOperatorFlags/raw/main/OperatorFlags.zip && \
# OpenSky moved its aircraft database to S3 and stopped publishing monthly
# files at the old URL; find the newest one by listing the bucket, as upstream
# docker-planefence does. Stored under the OpenSkyDb-YYYY-MM.csv name the
# rest of planefence expects.
    opensky="$(curl -sfL -m 30 'https://s3.opensky-network.org/data-samples/?prefix=metadata/' \
        | grep -oP '(?<=<Key>metadata/)aircraft-database-complete-[0-9]{4}-[0-9]{2}\.csv(?=</Key>)' \
        | sort -r | head -n 1 || true)"; \
    if [ -n "$opensky" ] && curl --compressed --fail -sL -m 900 \
            -o "/usr/share/planefence/stage/OpenSkyDb-${opensky#aircraft-database-complete-}" \
            "https://s3.opensky-network.org/data-samples/metadata/$opensky"; \
    then \
        echo "Got OpenSkyDb from $opensky"; \
    else \
        echo "Couldn't download OpenSkyDb - continuing without"; \
    fi && \
#
# Ensure the planefence and plane-alert config is available for lighttpd:
    ln -sf /etc/lighttpd/conf-available/88-planefence.conf /etc/lighttpd/conf-enabled && \
    ln -sf /etc/lighttpd/conf-available/88-plane-alert.conf /etc/lighttpd/conf-enabled && \
# Install dump1090.socket30003. Note - this could move to a lower layer, but we need to have rootfs copied in.
# In any case, it doesn't take much (build)time.
    pushd /src/socket30003 && \
       ./install.pl -install /usr/share/socket30003 -data /run/socket30003 -log /run/socket30003 -output /run/socket30003 -pid /run/socket30003 && \
       chmod a+x /usr/share/socket30003/*.pl && \
       rm -rf /run/socket30003/install-* && \
    popd && \
#
# Do some other stuff
    echo "alias dir=\"ls -alsv\"" >> /root/.bashrc && \
    echo "alias nano=\"nano -l\"" >> /root/.bashrc

#
# No need for SHELL and ENTRYPOINT as those are inherited from the base image
#

EXPOSE 80
