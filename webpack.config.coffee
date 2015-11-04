ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports =
  entry:'./client/src/client.cjsx' #main client script

  output:
    filename: './client/bundle.js'

  # resolveLoader:
  #   modulesDirectories: ['node_modules']

  resolve:
    extensions: ['', '.js', '.cjsx', '.coffee']

  module:
    loaders: [
      { test: /\.cjsx$/, loaders: ['coffee', 'cjsx']}
      { test: /\.coffee$/, loader: 'coffee' }
      { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") }
    ]

  plugins: [
      new ExtractTextPlugin("./client/style.css")
  ]
