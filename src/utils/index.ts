import { read, utils } from "xlsx";
export const getDatalist = async () => {
  const response = await fetch("/datalist.xlsx");
  const arrayBuffer = await response.arrayBuffer();
  const workbook = read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = utils.sheet_to_json(worksheet);
  return jsonData;
};
