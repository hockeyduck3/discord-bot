module.exports = {
    name: 'math',
    description: 'Do Common Math',
    execute(message, args) {
        if (args.length === 0) {
            message.reply('You didn\'t add anything.');
            return;
        }

        if (args.length % 2 === 0) {
            message.reply('Not enough arguments to calculate.');
            return;
        }

        let numArr = [];
    
        for (let i = 0; i < args.length; i++) {
            if (args[i].match(/[0-9]/g)) {
                if (args[i].includes('(')) {
                    const newNum = args[i].replace(/\(/g, '');
                    numArr.push('(');
                    numArr.push(parseInt(newNum));
                } 
                
                else if (args[i].includes(')')) {
                    const newNum = args[i].replace(/\)/g, '');
                    numArr.push(parseInt(newNum));
                    numArr.push(')');
                }

                else {
                    numArr.push(parseInt(args[i]));
                }
            }

            else {
                numArr.push(args[i].toLowerCase());
            }
        }

        const numStr = numArr.toString().replace(/,/g, ' ');

        const result = eval(numStr);

        message.reply(`The answer to your math problem is ${result}`);
    }
}
