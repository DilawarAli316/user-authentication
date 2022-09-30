const generateCode = () => {
  let rndNumber = Math.floor(Math.random() * 94521);
  let count = 0;
  let temp = "";

  for (const i of rndNumber.toString()) {
    if (count < 4) {
      temp += i;
    }
    ++count;
  }
  return parseInt(temp);
};

export default generateCode;
