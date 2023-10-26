export default (req, res) => {
  // Do something scheduled
};

export const config = {
  type: "experimental-scheduled",
  schedule: "@hourly",
};
