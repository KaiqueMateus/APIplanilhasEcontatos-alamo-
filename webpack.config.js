const path = require('path'); // Importa o módulo 'path' para lidar com caminhos de arquivos

module.exports = {
  mode: 'production', // Define o modo de construção (produção)
  entry: './frontend/main.js', // Define o arquivo de entrada do ponto de entrada do aplicativo
  output: {
    path: path.resolve(__dirname, 'public', 'assets', 'js'), // Define o caminho de saída para os arquivos gerados
    filename: 'bundle.js' // Define o nome do arquivo de saída
  },
  module: {
    rules: [{
      exclude: /node_modules/, // Exclui arquivos na pasta 'node_modules' do processo de compilação
      test: /\.js$/, // Define que as regras se aplicam a arquivos com extensão .js
      use: {
        loader: 'babel-loader', // Usa o loader 'babel-loader' para transpilar o código
        options: {
          presets: ['@babel/env'] // Configura o Babel para usar o preset '@babel/env'
        }
      }
    }, {
      test: /\.css$/, // Define que as regras se aplicam a arquivos com extensão .css
      use: ['style-loader', 'css-loader'] // Usa os loaders 'style-loader' e 'css-loader' para carregar arquivos CSS
    }]
  },
  devtool: 'source-map' // Define a geração de mapas de origem para depuração (source-map)
};
