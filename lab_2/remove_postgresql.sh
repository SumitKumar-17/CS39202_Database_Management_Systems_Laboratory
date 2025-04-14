#!/bin/bash

# This is a bash script to rmeove PostrgreSQl from the Linux Debian Distro

# Stop PostgreSQL service
sudo systemctl stop postgresql

# Disable PostgreSQL service from starting on boot
sudo systemctl disable postgresql

# Uninstall PostgreSQL and related dependencies
sudo pacman -Rns postgresql

# Optionally, remove PostgreSQL data directory
sudo rm -rf /var/lib/postgres

# Optionally, remove PostgreSQL configuration files
sudo rm -rf /etc/postgresql
