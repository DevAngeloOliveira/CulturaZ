const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Vigia apenas as dependências hoisted e os pacotes do workspace.
// NÃO vigia apps/api (projeto Kotlin/Gradle) para não sobrecarregar o Metro.
config.watchFolders = [
  path.join(workspaceRoot, 'node_modules'),
  path.join(workspaceRoot, 'packages'),
];

config.resolver.nodeModulesPaths = [
  path.join(projectRoot, 'node_modules'),
  path.join(workspaceRoot, 'node_modules'),
];

module.exports = config;
