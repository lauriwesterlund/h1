import toast from 'react-hot-toast';

const gameMessage = (message: string): void => {
  if (message) {
    toast(message);
    console.log(message);
  }
};

export default gameMessage;
