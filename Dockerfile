# This is file of the project ZEROFIT_NODEJS_SERVER
# Licensed under the MIT License.
# Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
# For full license text, see the LICENSE file in the root directory or at
# https://opensource.org/license/mit
# Author: Kim JunHo
# Latest Updated Date: 2024-12-18

# Fix Node.js Image Version
FROM node:23.1.0

# Set working directory
WORKDIR /app

# Install System Packages (Minimum Installation)
RUN apt-get update && apt-get install -y --no-install-recommends vim \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Copy only package.json and lock files for npm cache optimization
COPY package.json package-lock.json ./

# Install Dependencies
RUN npm install

# Copy application code
COPY ./ ./

# Container Port Number
EXPOSE 10103

# Automatically execute the following commands when the container is executed
CMD ["npm", "start"]