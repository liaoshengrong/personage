const xlsx = require("xlsx");
const fs = require("fs");

const filePath = "src/config/datalist.xlsx";
const outputJsonPath = "src/config/data.json";
function convertXlsxToJson() {
  // 读取 XLSX 文件
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  const jsonData = sheetNames.map((sheetName) => {
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return { [sheetName]: sheetData };
  });
  const data = jsonData[0].Sheet1.map((item) => ({
    tag: item["分类"],
    desc: item["描述"],
    date: item["日期"],
    title: item["标题"],
  }));

  // 将 JSON 数据写入到文件
  fs.writeFileSync(outputJsonPath, JSON.stringify(data, null, 4));
  console.log(`File has been written to ${outputJsonPath}`);
}

// 使用函数：传入你的 .xlsx 文件路径和输出的 .json 文件路径
convertXlsxToJson();

module.exports = convertXlsxToJson;
