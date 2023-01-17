const { bundleWorkflowCode } = require('@temporalio/worker');
const { writeFile } = require('fs/promises');
const { merge } = require('webpack-merge');

class RunPromiseWebpackPlugin {
  asyncHook;
  constructor(asyncHook) {
    this.asyncHook = asyncHook;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise("RunPromiseWebpackPlugin", this.asyncHook);
  }
}

async function bundleWorkflow() {
  const { code } = await bundleWorkflowCode({
    workflowsPath: require.resolve('./src/app/workflows.ts'),
  });
  await writeFile(
    './dist/apps/temporal-worker/workflow-bundle.js',
    code,
  );
}


module.exports = async (config, context) => {
  console.log("Executing webpack config");
  return await merge(config, {
    plugins: [
      new RunPromiseWebpackPlugin(bundleWorkflow),
    ]
  });
};