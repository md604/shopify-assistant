console.log('Search worker is ready for action');

const test = 'test';

addEventListener('message', e => {
    if (e.data === 'hello') {
      postMessage(`world ${test}`);
    }
});
export {}