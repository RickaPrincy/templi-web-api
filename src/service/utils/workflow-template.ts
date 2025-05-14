import { Buffer } from 'buffer';
import { Template } from 'src/model';
import { GenerateProjectPayload } from 'src/rest/model';
import * as dotenv from 'dotenv';

dotenv.config();

const formatCliArgs = (generateTemplate: GenerateProjectPayload) => {
  return generateTemplate.values
    .map(({ name, value }) => `-${name} "${value}"`)
    .join(' ');
};

const createWorkflowContent = (
  template: Template,
  generateTemplate: GenerateProjectPayload,
) => {
  return `
name: templi-generate 

on:
  push:
    branches: [ "main" ]

permissions:
  contents: write

jobs:
  process:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install TColor 
        run: bash <(curl -s https://raw.githubusercontent.com/RickaPrincy/TColor.hpp/main/install.sh)

      - name: Install rcli 
        run: bash <(curl -s https://raw.githubusercontent.com/RickaPrincy/rcli/main/install.sh)
      
      - name: Install Templi
        run: bash <(curl -s https://raw.githubusercontent.com/RickaPrincy/Templi/main/install.sh)

      - name: Delete all files except .git
        run: |
          find . -mindepth 1 -maxdepth 1 ! -name ".git" -exec rm -rf {} +
      
      - name: Generate project 
        run: |
          git config user.name "templi-web[bot]"
          git config user.email "${process.env.GITHUB_APP_ID}+templi-web[bot]@users.noreply.github.com"
          export LD_LIBRARY_PATH=/usr/local/lib:\\$LD_LIBRARY_PATH
          templi generate -t ${template.url}.git -o generated ${formatCliArgs(generateTemplate)}

      - name: Move generated files to root
        run: |
          shopt -s dotglob
          mv generated/* .
          rm -rf generated

      - name: Commit changes
        run: |
          git add --all 
          git commit -m "chore: generate project with templi" || echo "Nothing to commit"

      - name: Push changes
        uses: ad-m/github-push-action@v0.8.0
        with:
          github_token: $\{{ secrets.GITHUB_TOKEN }}
`;
};

export const generateWorkflowFile = (
  template: Template,
  payload: GenerateProjectPayload,
) => {
  return Buffer.from(createWorkflowContent(template, payload)).toString(
    'base64',
  );
};
