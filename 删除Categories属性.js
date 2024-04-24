const fs = require('fs');
const path = require('path');

function removeCategoriesProperty(filePath) {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');

    // 使用正则表达式删除categories属性
    content = content.replace(/categories:[\s\S]*?(\n-{3,})/, '$1');

    // 将修改后的内容写回文件
    fs.writeFileSync(filePath, content, 'utf8');
}

// 要处理的文件夹路径
const folderPath = './source/_posts/unity插件/unity_input_system';

// 遍历文件夹下的所有文件
fs.readdirSync(folderPath).forEach(file => {
    const filePath = path.join(folderPath, file);
    // 确保文件是Markdown文件
    if (path.extname(file).toLowerCase() === '.md') {
        removeCategoriesProperty(filePath);
        console.log(`Removed categories property from ${filePath}`);
    }
});

console.log('All files processed.');

