/* 第二章 · C 语言基础知识 */
window.COURSE.push({
  id: 'ch2',
  title: 'C 语言基础知识',
  icon: '🧱',
  intro: '数据类型、变量、常量、运算符，以及输入输出——打好语法地基。',
  chapters: [
    {
      id: '2-1',
      title: 'C 程序的结构与注释',
      lesson: [
        { t: 'p', x: '一个完整的 C 程序有固定的「骨架」，我们先熟悉它，以后每次写代码都先搭好骨架。' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    printf("你好\\n");
    return 0;
}`, out: '你好' },
        { t: 'h', x: '程序的三大部分' },
        { t: 'list', x: [
          '**预处理指令**（`#include ...`）：以 `#` 开头，编译前先处理。',
          '**主函数 `main`**：程序入口，`{ }` 之间是函数体，放要执行的语句。',
          '**语句**：函数体里的一条条命令，每条以分号结尾。'
        ] },
        { t: 'h', x: '注释：写给人类看的说明' },
        { t: 'p', x: '注释不会被编译执行，它只是帮助你（和读你代码的人）理解代码。C 语言有两种注释：' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    // 这是单行注释
    printf("你好\\n");   /* 这是块注释，可以跨行 */

    /*
      多行注释：
      写在 起始标记 和 结束标记 之间
    */
    return 0;
}`, out: '你好' },
        { t: 'warn', x: '块注释 `/* ... */` 不能嵌套。如果你在一个注释里又写了 `/*`，会出错。' },
        { t: 'tip', x: '养成写注释的习惯：给「这段代码在干嘛」加一句话说明，一个月后的你会感谢现在的你。' }
      ],
      examples: [
        { title: '用注释给自己做标记', code: `#include <stdio.h>
int main() {
    // 第一步：打印标题
    printf("==== 我的程序 ====\\n");
    // 第二步：打印内容
    printf("今天开始学 C 语言\\n");
    return 0;
}`, note: '注释不会影响程序运行，可以放心写。' }
      ]
    },
    {
      id: '2-2',
      title: '标识符、关键字、变量与常量',
      lesson: [
        { t: 'p', x: '程序要处理数据，数据需要有个「名字」才能被引用。给变量、函数起名字，用的就是**标识符**。' },
        { t: 'h', x: '标识符的命名规则' },
        { t: 'list', x: [
          '只能由**字母、数字、下划线**组成，且**不能以数字开头**。',
          '不能和**关键字**重名（如 `int`、`return`、`if`）。',
          '区分大小写：`age` 和 `Age` 是两个不同的名字。'
        ] },
        { t: 'h', x: '变量：会变的数据' },
        { t: 'p', x: '变量是一块有名字的内存，用来存放可以改变的值。使用前必须先**声明**（告诉编译器它是什么类型、叫什么名字），然后才能赋值。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int age;        // 声明一个整型变量 age
    age = 18;       // 给它赋值 18
    printf("年龄是 %d\\n", age);
    return 0;
}`, out: '年龄是 18' },
        { t: 'h', x: '常量：不变的数据' },
        { t: 'p', x: '常量是值不会改变的量。除了直接写数字，还可以用 `const` 或宏定义 `#define` 来给常量起名：' },
        { t: 'code', x: `#include <stdio.h>
#define PI 3.14159   // 用宏定义一个常量

int main() {
    const int DAYS = 7;   // 用 const 定义常量
    printf("一周有 %d 天，PI 约等于 %f\\n", DAYS, PI);
    return 0;
}`, out: '一周有 7 天，PI 约等于 3.141590' },
        { t: 'warn', x: '`const` 定义的常量一旦赋值就不能再修改，否则编译会报错。' }
      ],
      examples: [
        { title: '声明并输出多个变量', code: `#include <stdio.h>
int main() {
    int a = 10, b = 20;   // 一行声明两个变量
    int sum = a + b;
    printf("%d + %d = %d\\n", a, b, sum);
    return 0;
}`, note: '`%d` 是「占位符」，运行时会替换成后面变量的值。' }
      ]
    },
    {
      id: '2-3',
      title: '数据类型',
      lesson: [
        { t: 'p', x: '不同的数据（整数、小数、字符）在内存里占的空间不一样，所以 C 语言用**数据类型**来区分它们。声明变量时必须指定类型。' },
        { t: 'h', x: '最常用的几种基本类型' },
        { t: 'table', head: ['类型', '含义', '例子', '占位符'], rows: [
          ['`int`', '整数', '18、-5、0', '`%d`'],
          ['`float`', '单精度小数', '3.14', '`%f`'],
          ['`double`', '双精度小数（更精确）', '3.1415926', '`%f` 或 `%lf`'],
          ['`char`', '单个字符', '\'A\'、\'7\'', '`%c`']
        ] },
        { t: 'p', x: '其中 `int` 和 `char` 还可以加修饰符：`short`（更短）、`long`（更长）、`unsigned`（无符号，只能是非负数）。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int n = 42;
    float f = 3.14;
    double d = 2.718281828;
    char c = 'A';

    printf("%d %f %f %c\\n", n, f, d, c);
    return 0;
}`, out: '42 3.140000 2.718282 A' },
        { t: 'warn', x: '打印小数用 `%f`，打印整数用 `%d`，打印字符用 `%c`。**占位符和数据类型要匹配**，否则会输出乱七八糟的结果。' },
        { t: 'note', x: '字符 `char` 用**单引号**包起来（如 `\'A\'`），字符串用**双引号**（如 `"hello"`）。这两者不能混用。' }
      ],
      examples: [
        { title: '求圆的面积', code: `#include <stdio.h>
int main() {
    double pi = 3.14159;
    double r = 2.5;
    double area = pi * r * r;
    printf("半径 %.2f 的圆面积约 %.2f\\n", r, area);
    return 0;
}`, note: '`%.2f` 表示小数只保留 2 位。' }
      ]
    },
    {
      id: '2-4',
      title: '运算符与表达式',
      lesson: [
        { t: 'p', x: '运算符用来对数据进行计算，用运算符把变量、常量连起来，就组成了**表达式**。' },
        { t: 'h', x: '算术运算符' },
        { t: 'table', head: ['运算符', '含义', '例子'], rows: [
          ['`+` `-` `*`', '加、减、乘', '`a + b`'],
          ['`/`', '除', '`a / b`'],
          ['`%`', '取余（模）', '`a % b`']
        ] },
        { t: 'warn', x: '两个整数相除 `/` 会**丢掉小数部分**（整除）。例如 `5 / 2` 结果是 `2`，不是 `2.5`。想要小数，至少让其中一个变成小数：`5.0 / 2`。' },
        { t: 'h', x: '赋值运算符与复合赋值' },
        { t: 'p', x: '`=` 是赋值（把右边的值给左边），不是「等于」。还有 `+=`、`-=`、`*=` 等简写：`a += 3` 等价于 `a = a + 3`。' },
        { t: 'h', x: '自增自减' },
        { t: 'p', x: '`++` 和 `--` 让变量加 1 或减 1。`i++` 和 `++i` 都让 i 加 1，区别在于「先取值还是先加」：' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a = 5;
    printf("%d\\n", a++);   // 先取值再自增，打印 5，a 变成 6
    printf("%d\\n", ++a);   // 先自增再取值，a 变成 7，打印 7
    printf("%d\\n", 10 % 3); // 取余，结果是 1
    return 0;
}`, out: '5\n7\n1' },
        { t: 'h', x: '关系与逻辑运算符' },
        { t: 'p', x: '关系运算符用于比较大小：`>`、`<`、`>=`、`<=`、`==`（等于）、`!=`（不等于）。逻辑运算符：`&&`（与）、`||`（或）、`!`（非）。这些下一章会大量用到。' },
        { t: 'warn', x: '判断「相等」要用**两个等号** `==`。只写一个 `=` 是赋值，是新手最容易犯的错。' }
      ],
      examples: [
        { title: '整数除法的坑', code: `#include <stdio.h>
int main() {
    printf("%d\\n", 5 / 2);     // 整数除法，结果是 2
    printf("%f\\n", 5.0 / 2);   // 有小数参与，结果 2.5
    printf("%d\\n", 7 % 3);     // 取余，结果 1
    return 0;
}`, note: '注意第一行和第三行的区别：`/` 是除，`%` 是取余。' }
      ]
    },
    {
      id: '2-5',
      title: '类型转换',
      lesson: [
        { t: 'p', x: '有时需要把一种类型的数据转成另一种类型，C 语言提供了**自动转换**和**强制转换**两种方式。' },
        { t: 'h', x: '自动类型转换' },
        { t: 'p', x: '不同类型的数据一起运算时，C 会自动把「窄」的类型转成「宽」的类型。比如 `int` 和 `double` 运算，结果会自动变成 `double`：' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a = 5;
    double b = 2.0;
    printf("%f\\n", a / b);  // a 自动转成 double，结果是 2.500000
    return 0;
}`, out: '2.500000' },
        { t: 'h', x: '强制类型转换' },
        { t: 'p', x: '也可以手动转换，语法是在数据前写 `(类型)`：' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a = 5, b = 2;
    double r = (double)a / b;   // 把 a 强制转成 double
    printf("%f\\n", r);         // 2.500000
    return 0;
}`, out: '2.500000' },
        { t: 'h', x: '转成整数会截断小数' },
        { t: 'p', x: '把小数转成整数时，会**直接丢掉小数部分**（不是四舍五入）。例如 `(int)3.9` 结果是 `3`。' },
        { t: 'warn', x: '`printf` 里占位符要和实际数据类型匹配。比如 `%f` 对应 `double`，`%d` 对应 `int`，用错了输出会错误。' }
      ],
      examples: [
        { title: '取平均值（保留小数）', code: `#include <stdio.h>
int main() {
    int n1 = 90, n2 = 80, n3 = 95;
    double avg = (n1 + n2 + n3) / 3.0;
    printf("平均分 = %.2f\\n", avg);
    return 0;
}`, note: '除以 `3.0` 而不是 `3`，结果才是小数。' }
      ]
    },
    {
      id: '2-6',
      title: '输入输出：printf 与 scanf',
      lesson: [
        { t: 'p', x: '程序要和用户交互，就要能**输出**（显示结果）和**输入**（读取用户敲的内容）。最常用的就是 `printf` 和 `scanf`。' },
        { t: 'h', x: 'printf：格式化输出' },
        { t: 'p', x: '`printf("格式字符串", 变量1, 变量2, ...)`。格式字符串里的占位符会被后面的变量依次替换：' },
        { t: 'table', head: ['占位符', '对应类型'], rows: [
          ['`%d`', '整数 int'],
          ['`%f`', '小数 float/double'],
          ['`%c`', '字符 char'],
          ['`%s`', '字符串'],
          ['`%.2f`', '小数保留两位']
        ] },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int age = 18;
    double height = 1.75;
    printf("我今年 %d 岁，身高 %.2f 米\\n", age, height);
    return 0;
}`, out: '我今年 18 岁，身高 1.75 米' },
        { t: 'h', x: 'scanf：输入' },
        { t: 'p', x: '`scanf` 用来读用户输入。注意：`scanf` 读取变量时，变量名前面要加**取地址符 `&`**。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a, b;
    printf("请输入两个整数：");
    scanf("%d %d", &a, &b);   // 注意 & 号
    printf("它们的和是 %d\\n", a + b);
    return 0;
}` },
        { t: 'p', x: '运行上面程序时，在「输入」框里填两个整数（用空格隔开），点运行，就能看到结果。' },
        { t: 'warn', x: '`scanf` 里变量前必须写 `&`（取地址符）。这是新手最常见、最隐蔽的错误之一，忘写 `&` 程序会崩溃或出错。' },
        { t: 'tip', x: '本网站的「运行」只对不要求输入的程序直接出结果。需要输入时，请先点右侧的「提交判题」或在输入框填数据——在训练题的编程题里会自动喂入测试数据。' }
      ],
      examples: [
        { title: '输入两个数并求和', code: `#include <stdio.h>
int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    printf("%d + %d = %d\\n", x, y, x + y);
    return 0;
}`, note: '点运行后，在输入框填两个整数（如 `3 5`）再运行。' }
      ]
    }
  ],
  quiz: {
    title: '第二章 · 训练题',
    choice: [
      { q: '下列哪个标识符是**不合法**的？', options: ['`age`', '`_name`', '`2abc`', '`my_var`'], answer: 2, explain: '标识符不能以数字开头，`2abc` 以数字开头，不合法。' },
      { q: '下列哪个是 C 语言的关键字？', options: ['`printf`', '`int`', '`main`', '`scanf`'], answer: 1, explain: '`int` 是关键字（类型名）；`printf`、`scanf`、`main` 是函数/标识符，不是关键字。' },
      { q: '表达式 `5 / 2` 的值是？', options: ['2.5', '2', '3', '编译报错'], answer: 1, explain: '两个整数相除是整除，结果丢掉小数部分，`5 / 2` 得 2。' },
      { q: '表达式 `7 % 3` 的值是？', options: ['2', '1', '2.33', '0'], answer: 1, explain: '`%` 是取余，7 除以 3 余 1。' },
      { q: '用 `scanf` 读入整型变量 `a`，正确的写法是？', options: ['`scanf("%d", a)`', '`scanf("%d", &a)`', '`scanf("%d", a)` 都行', '`input(a)`'], answer: 1, explain: '`scanf` 读取变量时必须加取地址符 `&`。' },
      { q: '打印双精度浮点数的占位符是？', options: ['`%d`', '`%c`', '`%f`', '`%s`'], answer: 2, explain: '`%f` 对应 float/double；`%d` 是整数，`%c` 是字符，`%s` 是字符串。' }
    ],
    fill: [
      { q: 'C 语言中，单行注释以 `____` 开头。', answer: '//', explain: '`//` 后到行尾都是注释。' },
      { q: '判断两个值是否相等，要用运算符 `____`。', answer: '==', explain: '`==` 是比较相等，单个 `=` 是赋值。' },
      { q: '表示「字符」类型的关键字是 `____`。', answer: 'char', explain: '`char` 表示单个字符，占 1 个字节。' },
      { q: '让整数变量 `i` 自增 1，可以写成 `i = i + 1`，也可以简写为 `____`。', answer: 'i++', accept: ['++i', 'i++；', 'i+=1'], explain: '`i++` 或 `++i` 都让 i 加 1。' }
    ],
    code: [
      {
        title: '两数相加', level: 'easy',
        prompt: '从标准输入读入两个整数 `a` 和 `b`（用空格隔开），输出它们的和（末尾换行）。',
        starter: `#include <stdio.h>
int main() {
    int a, b;
    // 读入 a、b 并输出 a+b
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}`,
        explain: '用 `scanf` 读入两个整数（记得加 `&`），再用 `printf` 输出和。',
        tests: [{ stdin: '3 5', expected: '8' }, { stdin: '10 20', expected: '30' }, { stdin: '-4 9', expected: '5' }]
      },
      {
        title: '求圆的面积', level: 'mid',
        prompt: '读入圆的半径 `r`（可能是小数），计算并输出圆的面积，保留 2 位小数。圆周率取 3.14159。面积 = π × r²。',
        starter: `#include <stdio.h>
int main() {
    double r;
    // 读入 r，计算面积并输出（%.2f）
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    double r;
    scanf("%lf", &r);
    printf("%.2f\\n", 3.14159 * r * r);
    return 0;
}`,
        explain: '半径可能是小数，用 `double`；读入用 `%lf`，输出用 `%.2f` 保留两位。',
        tests: [{ stdin: '1', expected: '3.14' }, { stdin: '2', expected: '12.57' }]
      },
      {
        title: '摄氏转华氏', level: 'mid',
        prompt: '读入摄氏温度 `c`（整数），按公式 `F = c × 9 / 5 + 32` 计算华氏温度，输出整数结果。',
        starter: `#include <stdio.h>
int main() {
    int c;
    // 读入 c，输出 F = c * 9 / 5 + 32
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int c;
    scanf("%d", &c);
    printf("%d\\n", c * 9 / 5 + 32);
    return 0;
}`,
        explain: '注意运算顺序：先乘 9 再除 5，再整体加 32。',
        tests: [{ stdin: '100', expected: '212' }, { stdin: '0', expected: '32' }]
      }
    ]
  }
});
