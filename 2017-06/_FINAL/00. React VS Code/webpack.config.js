var webpack = require('webpack');

// module.exports = {
//   entry: "./src/main.ts",
//   output: {
//     filename: "sugbg.js",
//     path: __dirname + "/dist"
//   },
//   plugins: [
//     new webpack.SourceMapDevToolPlugin({
//       filename: 'sugbg.js.map',
//       noSources: true,
//       include: ['sugbg.js']
//     })
//   ],
//   // Enable sourcemaps for debugging webpack's output.
//   devtool: "source-map",
//   resolve: {
//     // Add '.ts' and '.tsx' as resolvable extensions.
//     extensions: [".ts", ".tsx", ".js", ".json"],
//     alias: {
//       jquery: "jquery/src/jquery"
//     }
//   },
//   module: {
//     rules: [
//       // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
//       { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
//       // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
//       { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
//       {
//         test: /\.scss$/,
//         exclude: /node_modules/,
//         use: [{
//           loader: "style-loader" // creates style nodes from JS strings
//         }, {
//           loader: "css-loader" // translates CSS into CommonJS
//         }, {
//           loader: "sass-loader" // compiles Sass to CSS
//         }]
//       }
//     ]
//   }

//   // When importing a module whose path matches one of the following, just
//   // assume a corresponding global variable exists and use that instead.
//   // This is important because it allows us to avoid bundling all of our
//   // dependencies, which allows browsers to cache those libraries between builds.
//   // externals: {
//   //     "react": "React",
//   //     "react-dom": "ReactDOM"
//   // },
// };


/// BABLE LOADER SETTINGS ///

var path = require('path');
var webpack = require('webpack');

var babelOptions = {
  "presets": [
    "react",
  ]
};

module.exports = {
  cache: true,
  entry: {
    main: './src/main.ts'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'sugbg.js',
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions
        },
        {
          loader: 'ts-loader'
        }
      ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions
        }
      ]
    }]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
};

//????
new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
}),
new webpack.optimize.UglifyJsPlugin()