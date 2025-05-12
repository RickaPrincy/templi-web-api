import { Buffer } from 'buffer';
import { Template } from 'src/model';
import { GenerateTemplate } from 'src/rest/model';

//TODO: refactor
const toSnakeCase = (value: string) => value.toLowerCase().replace(/_/g, '-');
const cliValues = (generateTemplate: GenerateTemplate) => {
  return generateTemplate.values
    .map(({ name, value }) => `-${toSnakeCase(name)} "${value}"`)
    .join(' ');
};

const workflowContent = (
  template: Template,
  generateTemplate: GenerateTemplate,
) => {
  return `
name: templi

on:
  push:
    branches: [main]

jobs:
  generate:
    runs-on: ubuntu-latest
    container:
      image: archlinux:latest

    steps:
      - name: Install git/base-devel
        run: |
          pacman -Syu --noconfirm
          pacman -S --noconfirm git base-devel

      - name: Install yay 
        run: |
          git clone https://aur.archlinux.org/yay.git
          cd yay
          makepkg -si --noconfirm

      - name: Install templi_cli with yay 
        run: yay -Sy --noconfirm --mflags "--noconfirm" templi_cli
      
      - name: generate project
        run: templi generate -t ${template.url} -o generated-project ${cliValues(generateTemplate)}
`;
};

//TODO: refactor: create service model
export const generateWorkFlows = (
  template: Template,
  generateTemplate: GenerateTemplate,
) => {
  return Buffer.from(workflowContent(template, generateTemplate)).toString(
    'base64',
  );
};
