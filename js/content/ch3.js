/* 第三章 · 程序控制结构 */
window.COURSE.push({
  id: 'ch3',
  title: '程序控制结构',
  icon: '🔀',
  intro: '用 if、switch、for、while 让程序会判断、会循环，处理各种逻辑。',
  chapters: [
    {
      id: '3-1',
      title: '顺序结构与 if 语句',
      lesson: [
        { t: 'p', x: '程序默认按**顺序结构**一行行往下执行。但光会顺序执行远远不够——我们需要程序能「看情况」决定走哪条路，这就是**选择结构**，最基本的工具是 `if`。' },
        { t: 'h', x: 'if 语句' },
        { t: 'p', x: '`if (条件) { 语句 }`：如果条件成立（真），就执行花括号里的语句；不成立就跳过。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int score = 80;
    if (score >= 60) {
        printf("及格了\\n");
    }
    return 0;
}`, out: '及格了' },
        { t: 'h', x: 'if-else 语句' },
        { t: 'p', x: '`if (条件) { ... } else { ... }`：条件成立走 `if`，不成立走 `else`。两条路必走其一。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int n = 7;
    if (n % 2 == 0) {
        printf("%d 是偶数\\n", n);
    } else {
        printf("%d 是奇数\\n", n);
    }
    return 0;
}`, out: '7 是奇数' },
        { t: 'warn', x: '判断相等用 `==`，不是 `=`。`if (n = 3)` 是把 3 赋给 n 并且恒为真，是经典 bug。' },
        { t: 'tip', x: '如果花括号里只有一条语句，可以省略花括号，但建议初学者**始终写上花括号**，更清晰、更不容易出错。' }
      ],
      examples: [
        { title: '判断一个数是正数还是负数', code: `#include <stdio.h>
int main() {
    int n = -5;
    if (n >= 0) {
        printf("非负数\\n");
    } else {
        printf("负数\\n");
    }
    return 0;
}`, note: '试试把 `n` 的值改成正数再看结果。' }
      ]
    },
    {
      id: '3-2',
      title: 'if-else 嵌套与 else if',
      lesson: [
        { t: 'p', x: '现实中的情况往往不止两种。比如成绩分等级：90 以上优秀、80 以上良好、60 以上及格、否则不及格。这时可以用 `else if` 连成一串。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int score = 85;
    if (score >= 90) {
        printf("优秀\\n");
    } else if (score >= 80) {
        printf("良好\\n");
    } else if (score >= 60) {
        printf("及格\\n");
    } else {
        printf("不及格\\n");
    }
    return 0;
}`, out: '良好' },
        { t: 'p', x: '程序从上往下判断，**第一个成立的分支执行后，后面的就不再判断了**。所以条件的顺序很关键。' },
        { t: 'h', x: '嵌套 if' },
        { t: 'p', x: '也可以在一个 `if` 里面再放一个 `if`，这叫**嵌套**：' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int age = 20;
    if (age >= 18) {
        if (age >= 60) {
            printf("老年\\n");
        } else {
            printf("成年\\n");
        }
    } else {
        printf("未成年\\n");
    }
    return 0;
}`, out: '成年' },
        { t: 'warn', x: '嵌套 if 时，`else` 会和**离它最近的、还没配对的 `if`** 配对。拿不准时，用花括号把每个分支包清楚。' },
        { t: 'tip', x: '遇到多分支判断，优先用 `else if` 串起来，比一层层嵌套更易读。' }
      ],
      examples: [
        { title: '判断一个数的正负与奇偶', code: `#include <stdio.h>
int main() {
    int n = 0;
    if (n > 0) {
        printf("正数\\n");
    } else if (n < 0) {
        printf("负数\\n");
    } else {
        printf("零\\n");
    }
    return 0;
}`, note: '改改 `n` 的值，观察三种情况。' }
      ]
    },
    {
      id: '3-3',
      title: 'switch 语句',
      lesson: [
        { t: 'p', x: '当一个变量要**和很多个固定值比较**时（比如星期几、菜单选项），用 `switch` 比一串 `else if` 更清晰。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int day = 3;
    switch (day) {
        case 1: printf("星期一\\n"); break;
        case 2: printf("星期二\\n"); break;
        case 3: printf("星期三\\n"); break;
        case 4: printf("星期四\\n"); break;
        case 5: printf("星期五\\n"); break;
        default: printf("周末\\n"); break;
    }
    return 0;
}`, out: '星期三' },
        { t: 'h', x: '关键点' },
        { t: 'list', x: [
          '`switch` 后面括号里是**要判断的变量**，通常是整数或字符。',
          '每个 `case` 后面是一个**值**，匹配到了就从这里开始执行。',
          '`break` 用来跳出 switch，**没有 break 会继续往下执行**（这叫「穿透」）。',
          '`default` 是「都没匹配上」时执行的兜底分支。'
        ] },
        { t: 'warn', x: '`case` 后面忘了写 `break` 是最常见的 switch 错误，会导致执行多个分支。' },
        { t: 'note', x: '`switch` 只能判断「等于某个固定值」，不能判断范围（比如 `case 1~10` 是不行的）。范围判断用 `if`。' }
      ],
      examples: [
        { title: '根据选项执行操作', code: `#include <stdio.h>
int main() {
    int choice = 2;
    switch (choice) {
        case 1: printf("开始游戏\\n"); break;
        case 2: printf("读取存档\\n"); break;
        case 3: printf("退出\\n"); break;
        default: printf("无效选项\\n");
    }
    return 0;
}`, note: '试试把 `choice` 改成 1、3 或其它数字。' }
      ]
    },
    {
      id: '3-4',
      title: 'while 与 do-while 循环',
      lesson: [
        { t: 'p', x: '循环结构让程序能**重复做一件事**。`while` 是最基本的循环：只要条件成立，就一遍遍执行循环体。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int i = 1;
    while (i <= 5) {
        printf("%d ", i);
        i++;              // 让 i 变大，否则会死循环
    }
    printf("\\n");
    return 0;
}`, out: '1 2 3 4 5' },
        { t: 'h', x: 'while 循环三要素' },
        { t: 'ol', x: [
          '**初始化**：循环开始前的变量（`int i = 1;`）。',
          '**条件**：每轮开始前检查（`i <= 5`）。',
          '**更新**：每轮结束后改变变量（`i++`），让循环有机会结束。'
        ] },
        { t: 'warn', x: '忘了写 `i++`（更新语句）会导致**死循环**——条件永远成立，程序卡住停不下来。' },
        { t: 'h', x: 'do-while 循环' },
        { t: 'p', x: '`do { ... } while (条件);` 和 while 几乎一样，区别是：**do-while 至少执行一次循环体**，先做再判断。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int i = 1;
    do {
        printf("%d ", i);
        i++;
    } while (i <= 5);
    printf("\\n");
    return 0;
}`, out: '1 2 3 4 5' },
        { t: 'tip', x: '用 while 还是 do-while？如果需要「无论如何先执行一次」，用 do-while；否则用 while 即可。' }
      ],
      examples: [
        { title: '累加 1 到 100', code: `#include <stdio.h>
int main() {
    int i = 1, sum = 0;
    while (i <= 100) {
        sum += i;
        i++;
    }
    printf("1 到 100 的和是 %d\\n", sum);
    return 0;
}`, note: '经典的累加求和，结果是 5050。' }
      ]
    },
    {
      id: '3-5',
      title: 'for 循环',
      lesson: [
        { t: 'p', x: '`for` 循环把「初始化、条件、更新」三要素写在一行里，特别适合「知道循环次数」的场景。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int i;
    for (i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`, out: '1 2 3 4 5' },
        { t: 'h', x: 'for 语句的结构' },
        { t: 'p', x: '`for (初始化; 条件; 更新) { 循环体 }`。执行顺序是：初始化（只做一次）→ 判断条件 → 执行循环体 → 更新 → 再判断条件……' },
        { t: 'p', x: '循环变量也可以直接在 for 里声明（C99 支持）：`for (int i = 1; i <= 5; i++)`。' },
        { t: 'h', x: '经典例子：打印 1~n 的偶数' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    for (int i = 2; i <= 10; i += 2) {
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`, out: '2 4 6 8 10' },
        { t: 'warn', x: 'for 的括号里三部分之间用**分号** `;` 隔开，不是逗号。' },
        { t: 'tip', x: '循环次数确定时用 `for` 最自然；次数不确定、由条件决定时用 `while`。' }
      ],
      examples: [
        { title: '打印 1 到 9 的平方', code: `#include <stdio.h>
int main() {
    for (int i = 1; i <= 9; i++) {
        printf("%d 的平方是 %d\\n", i, i * i);
    }
    return 0;
}`, note: '运行看看输出。' }
      ]
    },
    {
      id: '3-6',
      title: 'break、continue 与循环嵌套',
      lesson: [
        { t: 'p', x: '循环里有两个「控制开关」：`break` 和 `continue`。' },
        { t: 'h', x: 'break：直接结束整个循环' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    for (int i = 1; i <= 10; i++) {
        if (i == 6) {
            break;      // 到 6 就停止，跳出循环
        }
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`, out: '1 2 3 4 5' },
        { t: 'h', x: 'continue：跳过本轮，进入下一轮' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    for (int i = 1; i <= 6; i++) {
        if (i == 3) {
            continue;   // 跳过 3，继续下一轮
        }
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`, out: '1 2 4 5 6' },
        { t: 'h', x: '循环嵌套' },
        { t: 'p', x: '一个循环里再放一个循环，就是**嵌套循环**。最常见的例子是打印乘法表：' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    for (int i = 1; i <= 9; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%d×%d=%d ", j, i, i * j);
        }
        printf("\\n");
    }
    return 0;
}` },
        { t: 'tip', x: '读嵌套循环：外层每走一步，内层会完整跑一遍。上面的例子就是「i 从 1 到 9，每个 i 对应内层 j 从 1 到 i」。' }
      ],
      examples: [
        { title: '打印一个由星号组成的三角形', code: `#include <stdio.h>
int main() {
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) {
            printf("*");
        }
        printf("\\n");
    }
    return 0;
}`, note: '外层控制行数，内层控制每行打印几个星号。' }
      ]
    }
  ],
  quiz: {
    title: '第三章 · 训练题',
    choice: [
      { q: '下列哪个语句用于「多分支」判断，适合和多个固定值比较？', options: ['`if`', '`while`', '`switch`', '`for`'], answer: 2, explain: '`switch` 适合和多个固定值比较的多分支判断。' },
      { q: '循环 `for (int i = 1; i <= 5; i++)` 会执行循环体几次？', options: ['4 次', '5 次', '6 次', '1 次'], answer: 1, explain: 'i 从 1 到 5（含），共 5 次。' },
      { q: '`break` 语句在循环中的作用是？', options: ['跳过本轮进入下一轮', '结束整个循环', '暂停 1 秒', '没有任何作用'], answer: 1, explain: '`break` 直接跳出当前循环；`continue` 才是跳过本轮。' },
      { q: '`while (0)` 的循环体会执行吗？', options: ['执行 1 次', '执行无数次', '不执行', '编译报错'], answer: 2, explain: '条件 0 为假，循环体一次都不执行。' },
      { q: '判断整数 `n` 是偶数，正确的条件是？', options: ['`n % 2 == 0`', '`n / 2 == 0`', '`n % 2 == 1`', '`n = 2`'], answer: 0, explain: '偶数能被 2 整除，即 `n % 2 == 0`。' },
      { q: '`switch` 里，每个 `case` 分支结尾通常要写什么来避免「穿透」？', options: ['`continue`', '`return`', '`break`', '`end`'], answer: 2, explain: '`break` 跳出 switch，避免继续执行下一个分支。' }
    ],
    fill: [
      { q: '`do-while` 和 `while` 的区别是：`do-while` 的循环体至少执行 `____` 次。', answer: '1', accept: ['一次', '1次'], explain: 'do-while 先执行再判断，所以至少执行一次。' },
      { q: '在循环里，`____` 语句用于跳过本轮循环，进入下一轮。', answer: 'continue', explain: '`continue` 跳过本轮剩余语句，继续下一轮。' },
      { q: '`for` 循环括号里三个部分之间用 `____` 分隔。', answer: ';', accept: ['分号'], explain: '格式是 `for(初始化; 条件; 更新)`，用分号分隔。' }
    ],
    code: [
      {
        title: '判断奇偶', level: 'easy',
        prompt: '读入一个整数 `n`，如果是偶数输出 `偶数`，否则输出 `奇数`（末尾换行）。',
        starter: `#include <stdio.h>
int main() {
    int n;
    // 读入 n 并判断奇偶
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    if (n % 2 == 0) {
        printf("偶数\\n");
    } else {
        printf("奇数\\n");
    }
    return 0;
}`,
        explain: '用 `n % 2 == 0` 判断偶数，否则就是奇数。',
        tests: [{ stdin: '4', expected: '偶数' }, { stdin: '7', expected: '奇数' }, { stdin: '0', expected: '偶数' }]
      },
      {
        title: '求 1 到 n 的和', level: 'mid',
        prompt: '读入一个正整数 `n`，输出 `1 + 2 + ... + n` 的和（末尾换行）。',
        starter: `#include <stdio.h>
int main() {
    int n, sum = 0;
    // 读入 n，循环累加
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int n, sum = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    printf("%d\\n", sum);
    return 0;
}`,
        explain: '用一个 `sum` 变量累加，循环 `1` 到 `n` 把每个数加上去。',
        tests: [{ stdin: '10', expected: '55' }, { stdin: '100', expected: '5050' }, { stdin: '1', expected: '1' }]
      },
      {
        title: '判断闰年', level: 'hard',
        prompt: '读入一个年份 `y`，如果是闰年输出 `闰年`，否则输出 `平年`。闰年规则：能被 4 整除且不能被 100 整除，或者能被 400 整除。',
        starter: `#include <stdio.h>
int main() {
    int y;
    // 读入 y 并判断闰年
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int y;
    scanf("%d", &y);
    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
        printf("闰年\\n");
    } else {
        printf("平年\\n");
    }
    return 0;
}`,
        explain: '闰年条件：能被 4 整除且不能被 100 整除，或能被 400 整除。用逻辑运算符组合。',
        tests: [{ stdin: '2020', expected: '闰年' }, { stdin: '1900', expected: '平年' }, { stdin: '2000', expected: '闰年' }]
      }
    ]
  }
});
