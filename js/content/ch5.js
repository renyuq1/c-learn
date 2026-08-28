/* 第五章 · 函数 */
window.COURSE.push({
  id: 'ch5',
  title: '函数',
  icon: '🧩',
  intro: '把代码打包成函数，避免重复、让程序结构清晰，并掌握递归。',
  chapters: [
    {
      id: '5-1',
      title: '函数定义与调用',
      lesson: [
        { t: 'p', x: '**函数**是一段有名字的、可重复调用的代码块。把常用的功能写成一个函数，需要时「调用」它即可，不用每次重写。' },
        { t: 'h', x: '定义函数的格式' },
        { t: 'code', x: `#include <stdio.h>

// 定义一个函数：打印一条分隔线
void printLine() {
    printf("----------------\\n");
}

int main() {
    printLine();   // 调用函数
    printf("你好\\n");
    printLine();
    return 0;
}`, out: '----------------\n你好\n----------------' },
        { t: 'p', x: '函数定义的一般形式：`返回类型 函数名(参数列表) { 函数体 }`。上面的 `void` 表示「不返回值」。' },
        { t: 'h', x: '为什么用函数' },
        { t: 'list', x: [
          '**避免重复**：同一段逻辑写一次，到处调用。',
          '**结构清晰**：把大问题拆成小函数，每个函数只做一件事。',
          '**便于修改**：改一处，所有调用的地方都生效。'
        ] },
        { t: 'warn', x: '函数要**先定义再使用**（或者在前面先写声明）。如果 `main` 在 `printLine` 前面就调用它，编译器会报错。' },
        { t: 'tip', x: '以后写程序养成习惯：`main` 尽量短，把具体工作拆到一个个函数里。' }
      ],
      examples: [
        { title: '定义并调用自己的函数', code: `#include <stdio.h>

void greet() {
    printf("欢迎学习 C 语言！\\n");
}

int main() {
    greet();
    greet();   // 调用两次
    return 0;
}`, note: '函数定义一次，可以调用多次。' }
      ],
      exercises: [
        {
          id: 'ex-5-1-1', title: '定义并调用 printLine', level: 'easy',
          prompt: '定义一个函数 `printLine()`，它打印一行 `----------`；然后在 `main` 中调用它两次，打印出两行分隔线。',
          starter: `#include <stdio.h>

// 在这里定义 printLine 函数
int main() {
    // 调用 printLine 两次
    return 0;
}`,
          hint: '定义 `void printLine() { printf("----------\\n"); }`，再在 main 里写两次 `printLine();`。',
          tests: [{ stdin: '', expected: '----------\n----------' }]
        },
        {
          id: 'ex-5-1-2', title: '定义并调用 greet', level: 'easy',
          prompt: '定义一个函数 `greet()`，打印 `欢迎学习 C 语言！`，并在 `main` 中调用它。',
          starter: `#include <stdio.h>

// 在这里定义 greet 函数
int main() {
    // 调用 greet
    return 0;
}`,
          hint: '定义 `void greet() { printf("欢迎学习 C 语言！\\n"); }`，再在 main 里 `greet();`。',
          tests: [{ stdin: '', expected: '欢迎学习 C 语言！' }]
        }
      ]
    },
    {
      id: '5-2',
      title: '函数参数与返回值',
      lesson: [
        { t: 'p', x: '函数可以通过**参数**接收输入，通过**返回值**把结果送出去。这样函数才能处理不同的数据。' },
        { t: 'code', x: `#include <stdio.h>

// 接收两个参数，返回较大值
int max(int a, int b) {
    if (a > b) return a;
    return b;
}

int main() {
    int x = max(3, 7);     // 调用，返回 7 赋给 x
    printf("%d\\n", x);
    printf("%d\\n", max(10, 5));
    return 0;
}`, out: '7\n10' },
        { t: 'h', x: '几个关键点' },
        { t: 'list', x: [
          '**形参**：定义函数时括号里的变量（`a`、`b`），是「占位」。',
          '**实参**：调用时传进去的具体值（`3`、`7`）。',
          '**返回值**：用 `return 值;` 把结果返回给调用处；函数类型要和返回值类型一致。',
          '`void` 类型的函数没有返回值，用 `return;` 直接结束即可。'
        ] },
        { t: 'warn', x: '形参和实参是**值传递**：函数里修改形参，不会影响调用处的实参变量。这点在讲指针时会再深入。' },
        { t: 'tip', x: '参数越多，函数越难用。一个函数参数最好别超过 3~4 个。' }
      ],
      examples: [
        { title: '求两个数的和', code: `#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(20, 30);
    printf("%d\\n", result);
    return 0;
}`, note: '函数返回 `a+b`，调用处接收结果。' }
      ],
      exercises: [
        {
          id: 'ex-5-2-1', title: '完成 add 函数', level: 'easy',
          prompt: '补全下面的 `add` 函数，让它返回两个整数的和。程序会读入两个数并调用它输出。',
          starter: `#include <stdio.h>

// 定义 add 函数，返回两个整数的和
int add(int a, int b) {
    // 在这里返回 a + b
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    printf("%d\\n", add(x, y));
    return 0;
}`,
          hint: '函数体里写 `return a + b;`。',
          tests: [{ stdin: '3 7', expected: '10' }, { stdin: '20 30', expected: '50' }]
        },
        {
          id: 'ex-5-2-2', title: '完成 max 函数', level: 'mid',
          prompt: '补全 `max` 函数，返回两个整数中较大的一个。程序会读入两个数并调用它输出。',
          starter: `#include <stdio.h>

// 定义 max 函数，返回较大值
int max(int a, int b) {
    // 在这里返回较大的那个
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    printf("%d\\n", max(x, y));
    return 0;
}`,
          hint: '`if (a > b) return a; else return b;`。',
          tests: [{ stdin: '3 7', expected: '7' }, { stdin: '9 4', expected: '9' }]
        },
        {
          id: 'ex-5-2-3', title: '完成 square 函数', level: 'easy',
          prompt: '补全 `square` 函数，返回整数 `x` 的平方。程序会读入一个数并调用它输出。',
          starter: `#include <stdio.h>

// 定义 square 函数，返回 x 的平方
int square(int x) {
    // 在这里返回 x * x
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", square(n));
    return 0;
}`,
          hint: '函数体里写 `return x * x;`。',
          tests: [{ stdin: '6', expected: '36' }, { stdin: '9', expected: '81' }]
        }
      ]
    },
    {
      id: '5-3',
      title: '递归函数',
      lesson: [
        { t: 'p', x: '**递归**就是函数**自己调用自己**。它适合「把问题拆成更小的同类问题」的场景，比如求阶乘、斐波那契数列。' },
        { t: 'h', x: '递归求阶乘' },
        { t: 'p', x: '阶乘定义：`n! = n × (n-1)!`，且 `0! = 1`。用递归写非常自然：' },
        { t: 'code', x: `#include <stdio.h>

int fact(int n) {
    if (n == 0) return 1;      // 递归出口：0! = 1
    return n * fact(n - 1);    // 递归：n! = n × (n-1)!
}

int main() {
    printf("%d\\n", fact(5));
    return 0;
}`, out: '120' },
        { t: 'h', x: '递归的两个必要条件' },
        { t: 'ol', x: [
          '**递归出口**（终止条件）：必须有能直接返回答案、不再递归的情况，否则会无限递归。',
          '**递归关系**：把大问题表示成更小规模的同类问题。'
        ] },
        { t: 'warn', x: '忘了写递归出口会导致**无限递归**，最终栈溢出崩溃。写递归先想清楚「什么时候停」。' },
        { t: 'tip', x: '递归代码优雅但**效率不一定高**（比如直接递归求斐波那契会重复计算很多次）。初学先会用、能看懂即可。' }
      ],
      examples: [
        { title: '递归求斐波那契数列', code: `#include <stdio.h>

int fib(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fib(n - 1) + fib(n - 2);
}

int main() {
    for (int i = 0; i <= 6; i++) {
        printf("%d ", fib(i));
    }
    printf("\\n");
    return 0;
}`, note: '斐波那契：0, 1, 1, 2, 3, 5, 8。' }
      ],
      exercises: [
        {
          id: 'ex-5-3-1', title: '递归求阶乘', level: 'mid',
          prompt: '用**递归**补全 `fact(n)`，计算 n 的阶乘（`0! = 1`，`n! = n × (n-1)!`）。',
          starter: `#include <stdio.h>

// 递归定义 fact(n) = n!
int fact(int n) {
    // 递归出口 + 递归关系
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", fact(n));
    return 0;
}`,
          hint: '`if (n == 0) return 1; return n * fact(n - 1);`。',
          tests: [{ stdin: '5', expected: '120' }, { stdin: '0', expected: '1' }]
        },
        {
          id: 'ex-5-3-2', title: '递归求斐波那契', level: 'hard',
          prompt: '用**递归**补全 `fib(n)`：`fib(0)=0`、`fib(1)=1`、`fib(n)=fib(n-1)+fib(n-2)`。',
          starter: `#include <stdio.h>

// 递归定义 fib(n)
int fib(int n) {
    // 递归出口 + 递归关系
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", fib(n));
    return 0;
}`,
          hint: '`if (n == 0) return 0; if (n == 1) return 1; return fib(n-1) + fib(n-2);`。',
          tests: [{ stdin: '6', expected: '8' }, { stdin: '1', expected: '1' }]
        }
      ]
    },
    {
      id: '5-4',
      title: '变量的作用域与生命周期',
      lesson: [
        { t: 'p', x: '变量不是「在哪里都能用」的。它有一个**作用域**（能使用的范围），和一个**生命周期**（存活的时间）。' },
        { t: 'h', x: '局部变量' },
        { t: 'p', x: '在函数（或花括号块）里定义的变量是**局部变量**，只在那个块里有效，出了块就销毁。' },
        { t: 'code', x: `#include <stdio.h>

int a = 100;   // 全局变量：整个文件都能用

void f() {
    int b = 10;          // 局部变量：只在 f 里有效
    printf("a=%d b=%d\\n", a, b);
}

int main() {
    f();
    printf("a=%d\\n", a);
    // printf("%d", b);  // 错误！b 在 main 里不存在
    return 0;
}`, out: 'a=100 b=10\na=100' },
        { t: 'h', x: 'static 与局部变量的生命周期' },
        { t: 'p', x: '普通局部变量每次进入函数都会**重新创建**。加 `static` 关键字后，它只在第一次初始化，之后**保留上一次的值**：' },
        { t: 'code', x: `#include <stdio.h>

void counter() {
    static int n = 0;   // 静态变量，值会保留
    n++;
    printf("%d ", n);
}

int main() {
    counter();   // 1
    counter();   // 2
    counter();   // 3
    printf("\\n");
    return 0;
}`, out: '1 2 3' },
        { t: 'warn', x: '尽量**少用全局变量**：它到处都能改，程序大了很难排查是谁改的。优先用参数和返回值传递数据。' },
        { t: 'tip', x: '不同函数里的同名局部变量互不干扰，因为它们各自有独立的作用域。' }
      ],
      examples: [
        { title: '观察普通局部变量 vs 静态变量', code: `#include <stdio.h>

void normal() {
    int n = 0;
    n++;
    printf("普通: %d\\n", n);
}

void withStatic() {
    static int n = 0;
    n++;
    printf("静态: %d\\n", n);
}

int main() {
    normal(); normal();
    withStatic(); withStatic();
    return 0;
}`, note: '普通变量每次重置，静态变量会累积。' }
      ],
      exercises: [
        {
          id: 'ex-5-4-1', title: '用 static 计数', level: 'mid',
          prompt: '补全 `counter` 函数：用一个 `static` 变量，让它在每次调用时加 1 并打印。程序会连续调用它 3 次。',
          starter: `#include <stdio.h>

void counter() {
    // 用 static 变量，每次调用加 1 并打印
}

int main() {
    counter();
    counter();
    counter();
    printf("\\n");
    return 0;
}`,
          hint: '`static int n = 0; n++; printf("%d ", n);`，三次调用打印 1 2 3。',
          tests: [{ stdin: '', expected: '1 2 3' }]
        },
        {
          id: 'ex-5-4-2', title: '普通局部变量会重置', level: 'mid',
          prompt: '补全 `normal` 函数：用**普通局部变量**（不加 `static`）实现「每次调用加 1 并打印」。程序会调用它两次。',
          starter: `#include <stdio.h>

void normal() {
    // 用普通局部变量（不加 static）
}

int main() {
    normal();
    normal();
    printf("\\n");
    return 0;
}`,
          hint: '`int n = 0; n++; printf("%d ", n);`（不加 static），每次调用都重新从 0 开始，打印 1 1。',
          tests: [{ stdin: '', expected: '1 1' }]
        }
      ]
    },
    {
      id: '5-5',
      title: '常用库函数',
      lesson: [
        { t: 'p', x: 'C 语言自带了一大堆「标准库函数」，你只要 `#include` 对应的头文件就能用，不用自己造轮子。' },
        { t: 'h', x: '常用的库函数分类' },
        { t: 'table', head: ['头文件', '常用函数', '作用'], rows: [
          ['`stdio.h`', '`printf` / `scanf`', '输入输出'],
          ['`math.h`', '`sqrt` / `pow` / `fabs`', '数学计算'],
          ['`string.h`', '`strlen` / `strcpy` / `strcmp`', '字符串处理'],
          ['`stdlib.h`', '`malloc` / `free` / `rand`', '内存与工具'],
          ['`ctype.h`', '`isalpha` / `isdigit`', '字符判断']
        ] },
        { t: 'code', x: `#include <stdio.h>
#include <math.h>

int main() {
    printf("根号 16 = %.0f\\n", sqrt(16));
    printf("2 的 10 次方 = %.0f\\n", pow(2, 10));
    printf("-3.5 的绝对值 = %.1f\\n", fabs(-3.5));
    return 0;
}`, out: '根号 16 = 4\n2 的 10 次方 = 1024\n-3.5 的绝对值 = 3.5' },
        { t: 'warn', x: '用 `math.h` 里的函数（如 `sqrt`）时，某些编译器链接时需要加 `-lm`（本网站已自动处理）。' },
        { t: 'tip', x: '遇到「我想算个 X」时，先想想有没有现成的库函数。查库函数手册（man / 搜索引擎）是程序员的日常。' }
      ],
      examples: [
        { title: '用 rand 生成随机数', code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    for (int i = 0; i < 5; i++) {
        printf("%d ", rand() % 100);   // 0~99 的随机数
    }
    printf("\\n");
    return 0;
}`, note: '每次运行结果可能不同（受随机种子影响）。' }
      ],
      exercises: [
        {
          id: 'ex-5-5-1', title: '用 sqrt 求平方根', level: 'easy',
          prompt: '用 `sqrt` 计算 16 的平方根，用 `%.0f` 打印（不显示小数）。记得 `#include <math.h>`。',
          starter: `#include <stdio.h>
#include <math.h>
int main() {
    // 打印 sqrt(16)
    return 0;
}`,
          hint: '`printf("%.0f\\n", sqrt(16));`。',
          tests: [{ stdin: '', expected: '4' }]
        },
        {
          id: 'ex-5-5-2', title: '用 pow 计算次方', level: 'easy',
          prompt: '用 `pow` 计算 2 的 10 次方，用 `%.0f` 打印。',
          starter: `#include <stdio.h>
#include <math.h>
int main() {
    // 打印 pow(2, 10)
    return 0;
}`,
          hint: '`printf("%.0f\\n", pow(2, 10));`。',
          tests: [{ stdin: '', expected: '1024' }]
        },
        {
          id: 'ex-5-5-3', title: '读入数字求平方根', level: 'mid',
          prompt: '读入一个整数 `n`，输出它的平方根 `sqrt(n)`，保留两位小数（`%.2f`）。',
          starter: `#include <stdio.h>
#include <math.h>
int main() {
    int n;
    // 读入 n，输出 sqrt(n)（%.2f）
    return 0;
}`,
          hint: '`scanf("%d", &n); printf("%.2f\\n", sqrt(n));`。',
          tests: [{ stdin: '9', expected: '3.00' }, { stdin: '2', expected: '1.41' }]
        }
      ]
    }
  ],
  quiz: {
    title: '第五章 · 训练题',
    choice: [
      { q: '函数定义中，`void` 表示？', options: ['函数没有返回值', '函数没有参数', '函数会出错', '函数是空的'], answer: 0, explain: '`void` 表示该函数不返回任何值。' },
      { q: '函数返回值的类型应该和什么一致？', options: ['参数类型', '函数名', '函数声明时写的返回类型', '没有关系'], answer: 2, explain: '`return` 的值要和函数定义的返回类型一致。' },
      { q: '递归函数必须有什么？', options: ['至少两个参数', '递归出口（终止条件）', '循环语句', '全局变量'], answer: 1, explain: '必须有终止条件（递归出口），否则会无限递归。' },
      { q: '下列哪个变量是「全局变量」？', options: ['定义在函数内部的变量', '定义在所有函数外部的变量', '`static` 变量', '形参'], answer: 1, explain: '定义在所有函数外部的变量是全局变量。' },
      { q: '`static` 局部变量的特点是？', options: ['每次调用都重新初始化', '值在多次调用之间保留', '只能在 main 里用', '不能赋值'], answer: 1, explain: 'static 局部变量只初始化一次，之后值会保留。' },
      { q: '函数 `int max(int a, int b)` 中，`a` 和 `b` 叫做？', options: ['实参', '形参', '返回值', '全局变量'], answer: 1, explain: '定义函数时括号里的参数叫形参。' }
    ],
    fill: [
      { q: '在 C 语言中，函数返回一个值要用 `____` 语句。', answer: 'return', explain: '`return 值;` 把结果返回给调用处。' },
      { q: '`sqrt` 函数用于计算平方根，它定义在头文件 `____` 中。', answer: 'math.h', accept: ['<math.h>'], explain: '`sqrt`、`pow` 等数学函数在 `math.h` 中。' },
      { q: '函数 `int f(int n)` 的返回类型是 `____`。', answer: 'int', explain: '函数名前面写的 `int` 就是返回类型。' }
    ],
    code: [
      {
        title: '求两个数的最大值', level: 'easy',
        prompt: '读入两个整数 `a`、`b`，输出其中较大的一个（用 `if` 判断即可，末尾换行）。',
        starter: `#include <stdio.h>
int main() {
    int a, b;
    // 读入 a、b 并输出较大值
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    if (a > b) printf("%d\\n", a);
    else printf("%d\\n", b);
    return 0;
}`,
        explain: '比较 a 和 b，输出大的那个。',
        tests: [{ stdin: '3 7', expected: '7' }, { stdin: '9 4', expected: '9' }, { stdin: '5 5', expected: '5' }]
      },
      {
        title: '递归求阶乘', level: 'mid',
        prompt: '读入非负整数 `n`（0 ≤ n ≤ 12），输出 `n!`（n 的阶乘）。',
        starter: `#include <stdio.h>
int main() {
    int n;
    // 读入 n，计算并输出 n!
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    long long f = 1;
    for (int i = 1; i <= n; i++) f *= i;
    printf("%lld\\n", f);
    return 0;
}`,
        explain: '阶乘可以用循环累乘：1×2×…×n。注意结果可能较大，用 long long 更稳妥。',
        tests: [{ stdin: '5', expected: '120' }, { stdin: '0', expected: '1' }, { stdin: '10', expected: '3628800' }]
      },
      {
        title: '判断素数', level: 'hard',
        prompt: '读入一个大于 1 的整数 `n`，判断它是不是素数（只能被 1 和自身整除）。是输出 `素数`，否则输出 `合数`。',
        starter: `#include <stdio.h>
int main() {
    int n;
    // 读入 n，判断素数
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    int isPrime = 1;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) { isPrime = 0; break; }
    }
    if (isPrime) printf("素数\\n");
    else printf("合数\\n");
    return 0;
}`,
        explain: '只需试除到 √n：2 到 i*i<=n 之间只要有能整除的，就不是素数。',
        tests: [{ stdin: '7', expected: '素数' }, { stdin: '12', expected: '合数' }, { stdin: '97', expected: '素数' }]
      }
    ]
  }
});
