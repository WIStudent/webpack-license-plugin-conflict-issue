import webpack from 'webpack';
import chalk from 'chalk'

const {Compilation} = webpack;

const PLUGIN_NAME = 'my-logging-plugin';

export class MyLoggingPlugin {
  constructor() {
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      console.log(chalk.red(`\ncalled compilation: name: ${compilation.name}, isChild: ${compilation.compiler.isChild()}`));

      compilation.hooks.childCompiler.tap(PLUGIN_NAME, (childCompiler, compilerName) => {
        console.log(chalk.yellow(`\ncalled childCompiler: name: ${compilerName}, isChild: ${childCompiler.isChild()}`));
      });

      compilation.hooks.optimizeChunkAssets.tap(PLUGIN_NAME, (chunks) => {
        console.log(chalk.blue('\ncalled optimizeChunkAssets'));
        for (const [key, asset] of Object.entries(compilation.assets)) {
          console.log(chalk.blue(`asset: ${key}, size: ${asset.size()}`));
          if (key === 'oss-licenses.json') {
            console.log(chalk.blue(asset.source()));
          }
        }
      });

      // compilation.hooks.processAssets.tap({name: PLUGIN_NAME, stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE}, (assets) => {
      //   console.log(chalk.yellow('\ncalled processAssets PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE'));
      //   for (const key of Object.keys(assets)) {
      //     console.log(chalk.yellow(key));
      //   }
      // });

      // compilation.hooks.processAssets.tap({name: PLUGIN_NAME, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL}, (assets) => {
      //   console.log(chalk.green('\ncalled processAssets PROCESS_ASSETS_STAGE_ADDITIONAL'));
      //   for (const key of Object.keys(assets)) {
      //     console.log(chalk.green('assets:', key));
      //   }
      // });

      // compilation.hooks.afterProcessAssets.tap(PLUGIN_NAME, (assets) => {
      //   console.log(chalk.cyan('\ncalled afterProcessAssets'));
      //   for (const [key, asset] of Object.entries(assets)) {
      //     console.log(chalk.cyan(`asset: ${key}, size: ${asset.size()}`));
      //   }
      // });
    });

    compiler.hooks.emit.tap(PLUGIN_NAME, compilation => {
      console.log(chalk.red('\ncalled emit'));
    });

    compiler.hooks.assetEmitted.tap(PLUGIN_NAME, (_, { compilation, targetPath }) => {
        console.log(chalk.magenta('\nassetEmitted: targetPath', targetPath));
      }
    );
  }
}
