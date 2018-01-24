const path = require("path"),
  webpack = require('webpack'),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  CopyWebpackPlugin = require('copy-webpack-plugin')

var config = {
  entry: ["./src/index.js",],
  output: {
    path: __dirname + "/build",
    filename: "bundle.js"
  },

  devServer: {
    inline: true,
    contentBase: "./build",
    publicPath: "/",
    hot: true,
    port: 8080,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new CopyWebpackPlugin([{
      from: "assets/**/*",
      context: "./src/",
      to: "./",
    }]),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: [
          path.resolve(__dirname, "src")
        ],
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "[path][name].[ext]",
              outputPath: "./assets/",
              context: "./src/assets",
            },
          },
        ]
      },
    ]
  },
};


const devConfig = {
  entry: [
    "react-hot-loader/patch",
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
    ...config.entry
  ],
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "stylus-loader",
            options: {
              stylus: {
                "resolve url": true,
              },
            },
          },
        ],
      },
      ...config.module.rules
    ]
  }
}

const prodConfig = {
  plugins: [
    ...config.plugins,
    new ExtractTextPlugin("[name].css", {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      hash: true,
    })
  ],
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract("css-loader!stylus-loader"),
      },
      ...config.module.rules
    ]
  }
}

config = (process.env.NODE_ENV === "production") ?
  Object.assign({}, config, prodConfig) :
  Object.assign({}, config, devConfig)

module.exports = config
