const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();

const files = fs.readdirSync(path.resolve(__dirname, './snippets'));

// 复制文件到指定位置
async function copyFileTo(origin, target) {
  await fs.copy(origin, target);
  console.log(chalk.green(`代码片段创建成功`));
}

// 递归目录获取所有文件名称(dir/fileName)
function deepDir(dir, files = []) {
  const dirs = fs.readdirSync(path.resolve(__dirname, dir));
  dirs.forEach((file) => {
    // 如果是文件
    if (file.includes('.code-snippets')) {
      files.push(`${dir}/${file}`);
    } else {
      // 如果是文件夹
      deepDir(`${dir}/${file}`, files)
    }
  })
}


async function createSnippets(name) {
  const cwd = process.cwd();
  const files = []; // 递归得到的所有目录文件
  deepDir('./snippets', files);

  // 验证name合法性
  const arr = name.split('/');
  const filename = arr[arr.length - 1] + '.code-snippets';

  const validNameArr = files.map(file => {
    return file.replace(/.\/snippets\//g, '').split('.code-snippets')[0];
  })

  if (!validNameArr.includes(name)) {
    const arr = name.split('/');
    if (arr.length > 1) { // 目录下无该文件
      arr.pop(); // 删除最后一项文件名
      const dirPath = arr.join('/'); // 组装路径
      console.log(chalk.red(`代码片段库目录${dirPath}下不存在${filename}文件`));
    } else {
      console.log(chalk.red(`代码片段库一级目录中不存在${filename}文件`));
    }
    console.log('可执行 lhb-snippets create -h 查看可创建的命令')
    return;
  }
  const origin = path.resolve(__dirname, `./snippets/${name}.code-snippets`);
  
  const result = await fileExistPrompts(filename);
  const { cover = true, name: newName } = result;
  
  if (cover) {
    const target = path.resolve(cwd, `./.vscode/${filename}`);
    copyFileTo(origin, target);
  } else {
    const target = path.resolve(cwd, `./.vscode/${newName}.code-snippets`);
    copyFileTo(origin, target);
  }

}

// 已存在文件是否覆盖的会话
function fileExistPrompts(name) {
  return new Promise((resolve, reject) => {
    // 注册对话
    const questions = [
      {
        name: 'cover',
        type: 'confirm',
        message: chalk.red(`${name}文件已存在,是否覆盖(不可撤销)? `),
        when: (answers) => fs.existsSync(path.resolve(path.resolve(process.cwd(), './.vscode'), name))

      },
      {
        name: 'name',
        message: chalk.green('请设置文件名称(无需添加后缀)'),
        type: 'input',
        when: (answers) => answers.cover === false
      }
    ]
    prompt(questions).then((answers) => {
      resolve(answers);
    }).catch(err => {
      reject(err);
    })
  })
}

function help(files) {
  console.log('');
  console.log('Example:');
  files.forEach(file => {
    const name = file.replace(/.\/snippets\//g, '').split('.code-snippets')[0];
    console.log('    or');
    console.log(`创建${name}代码片段：lhb-snippets create ${name}`);
  })
}

module.exports = function create(program) {
  program
    .command('create <file-name>')
    .description('创建代码片段文件')
    .on('--help', () => {
      const files = [];
      deepDir('./snippets', files);
      help(files);
    })
    .action((name) => {
      createSnippets(name);
    })
}