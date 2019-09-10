(function(win) {
    const operations = new Map([
        ['+', (a, b) => a + b],
        ['sub1', (a, b) => a - b],
        ['sub2', (a, b) => b - a],
        ['*', (a, b) => a * b],
        ['div1', (a, b) => (a % b) ? null : a / b],
        ['div2', (a, b) => (b % a) ? null : b / a]
    ]);

    const operationFormater = new Map([
            ['+', (a, b, c) => `${a} + ${b} = ${c}`],
            ['sub1', (a, b, c) => `${a} - ${b} = ${c}`],
            ['sub2', (a, b, c) => `${b} - ${a} = ${c}`],
            ['*', (a, b, c) => `${a} * ${b} = ${c}`],
            ['div1', (a, b, c) => `${a} / ${b} = ${c}`],
            ['div2', (a, b, c) => `${b} / ${a} = ${c}`]
        ]
    );

    class Solver {
        constructor(nums, target) {
            this.draw = nums.slice(0);
            this.target = target;
            this.shortestSolution = null;
            this.shortestSolutionLength = Infinity;
            this.solutions = [];
            this.closest = Infinity;
            this.closestSolution = null;
        }

        dcSolver(nums, target, currentPath = '', pathLength = 0, saveSolutions = false) {
            for (let i = 0, len = nums.length; i < len; i++) {
                const num1 = nums[i];
                const temp = nums.slice(0);
                temp.splice(i, 1);
                for (let ind = i + 1; ind < len; ind++) {
                    const num2 = nums[ind];
                    const subNums = temp.slice(0);
                    subNums.splice(ind - 1, 1);
                    operations.forEach((operation, operand) => {
                        const res = operation(num1, num2);
                        // res === null -> non relative division || res === 0 -> diff = 0 meaning useless operations up until then
                        if (res && res > 0) {
                            const newPath = `${currentPath}${operationFormater.get(operand)(num1, num2, res)}\n`;
                            const newPathLength = pathLength + 1;
                            if (res === this.target) {
                                if (saveSolutions) this.solutions.push(newPath);
                                if (newPathLength < this.shortestSolutionLength) {
                                    this.shortestSolution = newPath;
                                    this.shortestSolutionLength = newPathLength;
                                }
                            } else {
                                if (Math.abs(this.closest - target) > Math.abs(res - target)) {
                                    this.closest = res;
                                    this.closestSolution = newPath;
                                }
                                this.dcSolver([res].concat(subNums), target, newPath, newPathLength);
                            }
                        }
                    });
                }
            }
        }

        solve() {
            this.dcSolver(this.draw, this.target);

            return (this.shortestSolution !== null) ? {result: this.target, solution: this.shortestSolution} : {result: this.closest, solution:this.closestSolution};
        }
    }

    function drawNumbers(length = 6, nums = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,25,50,75,100]) {
        const draw = [];

        for(let i = 0, l = Math.min(nums.length, length); i < l; i++) {
            draw.push(nums.splice(Math.floor(Math.random() * nums.length),1)[0]);
        }

        return draw;
    }

    function drawTarget(min = 101, max = 999) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function dcGame(drawSize = 6, min = 101, max = 999, nums = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,25,50,75,100]) {
        const draw = drawNumbers(drawSize, nums);
        const target = drawTarget(min, max);

        const solver = new Solver(draw, target);

        return {
            draw,
            target,
            ...solver.solve()
        };
    }

    function dcSolve({draw, target}) {
        return {...new Solver(draw, target).solve()};
    }

    function dcInit(drawSize = 6, min = 101, max = 999, nums = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,25,50,75,100]) {
        return {
            draw: drawNumbers(drawSize, nums),
            target: drawTarget(min, max)
        }
    }

    win.dcInit = dcInit;
    win.dcSolve = dcSolve;
})(window);
