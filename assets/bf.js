class BF {
    constructor() {
        this.code = '';
        this.currentValue = 0; // current cell value
    }

    // Main function: encode a string into Brainfuck
    encode(text) {
        this.code = '';
        this.currentValue = 0;

        for (let char of text) {
            const target = char.charCodeAt(0);
            this.addChar(target);
            this.code += '.'; // output character
        }

        return this.code;
    }

    // Add a character using minimal Brainfuck with loops
    addChar(target) {
        let diff = target - this.currentValue;

        if (diff === 0) return; // already correct
        if (Math.abs(diff) <= 10) {
            // small difference: just + or -
            this.code += (diff > 0 ? '+'.repeat(diff) : '-'.repeat(-diff));
        } else {
            // large difference: use loop optimization
            this.code += this.loopOptimize(diff);
        }

        this.currentValue = target;
    }

    // Generate optimized loop-based code for large differences
    loopOptimize(diff) {
        let absDiff = Math.abs(diff);
        let best = {total: Infinity, loop: 0, inner: 0, rem: 0};

        // Try all possible loop counts to find minimal total code
        for (let i = 2; i <= Math.sqrt(absDiff) + 1; i++) {
            let inner = Math.floor(absDiff / i);
            let rem = absDiff - inner * i;
            let total = i + inner + rem + 4; // +4 for [->+<] brackets
            if (total < best.total) {
                best = {total, loop: i, inner, rem};
            }
        }

        let code = '';
        if (best.loop > 1) {
            code += (diff > 0 ? '+'.repeat(best.loop) : '-'.repeat(best.loop)); // set loop counter
            code += '[>'; // loop start
            code += (diff > 0 ? '+'.repeat(best.inner) : '-'.repeat(best.inner)); // inner increments
            code += '<-]>'; // loop end
            code += (diff > 0 ? '+'.repeat(best.rem) : '-'.repeat(best.rem)); // remainder
        } else {
            code += (diff > 0 ? '+'.repeat(absDiff) : '-'.repeat(absDiff));
        }

        return code;
    }
}
