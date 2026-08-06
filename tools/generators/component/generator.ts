import {
  Tree,
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  names,
  readJson,
  updateJson,
} from '@nx/devkit';

export interface ComponentGeneratorSchema {
  name: string;
  description?: string;
}

/**
 * Scaffolds a new `packages/components/<name>` package.
 *
 * This exists because adding a component previously meant hand-copying ~10
 * config files from a sibling package, which is how three different
 * eslint.config.mjs variants and two different build-target shapes ended up
 * in the repo. The templates encode the conventions the library actually
 * settled on: signal inputs, OnPush, token-driven CSS with a shared focus
 * ring, a CDK harness, an axe assertion in the spec, and a package that
 * publishes from its built output.
 */
export default async function componentGenerator(
  tree: Tree,
  options: ComponentGeneratorSchema,
) {
  const { fileName: name, className } = names(options.name);
  const projectRoot = `packages/components/${name}`;

  if (tree.exists(projectRoot)) {
    throw new Error(
      `packages/components/${name} already exists. Pick a different name, or delete it first.`,
    );
  }

  const substitutions = {
    name,
    className,
    titleName: names(options.name).className.replace(
      /([a-z])([A-Z])/g,
      '$1 $2',
    ),
    description:
      options.description ??
      `${className} component for the design system's Angular component library.`,
    // generateFiles strips this suffix from every template filename.
    tmpl: '',
  };

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    projectRoot,
    substitutions,
  );

  // Register the package so imports resolve. Both entries are required: the
  // path mapping for TypeScript/Vitest, and the root dependency so pnpm
  // symlinks it into node_modules the way the other packages are.
  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.compilerOptions.paths[`@app-design-system/${name}`] = [
      `./${projectRoot}/src/index.ts`,
    ];
    return json;
  });

  const rootPkg = readJson(tree, 'package.json');
  if (!rootPkg.dependencies?.[`@app-design-system/${name}`]) {
    updateJson(tree, 'package.json', (json) => {
      json.dependencies = {
        ...json.dependencies,
        [`@app-design-system/${name}`]: 'workspace:*',
      };
      return json;
    });
  }

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}
