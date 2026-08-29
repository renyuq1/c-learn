/* 第九章 · 工程实践进阶 */
window.COURSE.push({
  id: 'ch9',
  title: '工程实践进阶',
  icon: '🛠️',
  intro: '从「会写语法」到「能写生产级代码」：多文件、内存、错误处理、调试、位运算与宏。',
  chapters: [
    {
      id: '9-1',
      title: '多文件项目与头文件',
      lesson: [
        { t: 'p', x: '前面的程序都塞在一个 `.c` 文件里。但**真实项目**动辄几十上百个源文件——把功能拆成多个文件，才能维护、复用、团队协作。' },
        { t: 'h', x: '为什么要拆文件' },
        { t: 'list', x: [
          '**好维护**：每个文件职责单一，改一处不影响别处。',
          '**可复用**：写好的功能模块，别的项目 `#include` 就能用。',
          '**能分工**：不同的人写不同文件，互不干扰。',
          '**编译快**：改了哪个文件，只重新编译它。'
        ] },
        { t: 'h', x: '头文件（.h）放什么' },
        { t: 'p', x: '头文件放**声明**（给别的文件看「有哪些接口」），不放实现。典型内容：' },
        { t: 'list', x: [
          '**函数声明（原型）**：`int square(int x);`',
          '**宏与常量**：`#define PI 3.14159`',
          '**类型定义**：`typedef struct { ... } Stu;`'
        ] },
        { t: 'h', x: '源文件（.c）放什么' },
        { t: 'p', x: '源文件放函数的**具体实现**，并在开头 `#include "自己的头文件"`。注意：自己写的头文件用**双引号** `""`，系统的用尖括号 `<>`。' },
        { t: 'h', x: '头文件保护（防止重复包含）' },
        { t: 'p', x: '同一个头文件可能被多个文件 `#include`，重复包含会导致「重复定义」报错。解决方法是加**头文件保护**：' },
        { t: 'code', x: `#include <stdio.h>

/* ===== 这是 math_util.h 的内容 ===== */
#ifndef MATH_UTIL_H        // 如果还没定义过，才往下走
#define MATH_UTIL_H        // 定义一个标记

int square(int x);         // 函数声明

#endif                     // 结束保护

/* ===== 这是 math_util.c 的内容 ===== */
int square(int x) {
    return x * x;
}

/* ===== 这是 main.c 的内容 ===== */
int main() {
    printf("%d\\n", square(8));
    return 0;
}`, out: '64' },
        { t: 'h', x: 'static：让函数「只在当前文件可见」' },
        { t: 'p', x: '不想让别的文件用到的辅助函数，加 `static` 修饰，避免函数名冲突。' },
        { t: 'code', x: `#include <stdio.h>

// static：只在当前文件内部可见，别的文件不能用
static int max(int a, int b) {
    return a > b ? a : b;
}

int main() {
    printf("较大的是 %d\\n", max(10, 20));
    return 0;
}`, out: '较大的是 20' },
        { t: 'tip', x: '一句话记忆：**声明放头文件，实现放源文件，头文件加保护**。这就是 C 项目最基本的组织方式。' },
        { t: 'note', x: '多文件项目在本地用 `gcc main.c math_util.c -o app` 一起编译；本网站在线编译器一次只能编译一个文件，所以上面用「注释分隔」的方式演示结构。' }
      ],
      examples: [
        { title: '声明在前、实现在后', code: `#include <stdio.h>

// 相当于头文件里的「函数原型」
double circle_area(double r);

int main() {
    printf("面积约 %.2f\\n", circle_area(5.0));
    return 0;
}

// 相当于 .c 文件里的「函数实现」
double circle_area(double r) {
    return 3.14159 * r * r;
}`, note: '先声明后实现，编译器才能知道这个函数长什么样。' }
      ],
      exercises: [
        {
          id: 'ex-9-1-1', title: '用 static 定义辅助函数', level: 'easy',
          prompt: '写一个程序，定义一个 `static` 函数 `square`（返回整数的平方），在 `main` 里调用它打印 `5` 的平方。',
          starter: `#include <stdio.h>
int main() {
    // 定义一个 static 函数 square，并调用打印 square(5)
    return 0;
}`,
          hint: '`static int square(int x) { return x * x; }`，再 `printf("%d\\n", square(5));`。',
          tests: [{ stdin: '', expected: '25' }]
        },
        {
          id: 'ex-9-1-2', title: '声明与实现分离', level: 'mid',
          prompt: '把功能拆成三段：先声明 `int add(int a, int b);`，再实现它返回两数之和，最后在 `main` 里调用打印 `add(3, 4)`。',
          starter: `#include <stdio.h>
int main() {
    // 先声明 add，再在 main 后实现，并打印 add(3, 4)
    return 0;
}`,
          hint: '声明 `int add(int a, int b);` 放在 main 前；`int add(int a, int b) { return a + b; }` 放在 main 后。',
          tests: [{ stdin: '', expected: '7' }]
        }
      ]
    },
    {
      id: '9-2',
      title: '动态内存管理进阶',
      lesson: [
        { t: 'p', x: '第 7 章学过 `malloc`/`free`。这一节深入动态内存的**常见错误**和**进阶用法**——内存问题是最容易让 C 程序崩溃、最难排查的一类 bug。' },
        { t: 'h', x: '四个函数回顾' },
        { t: 'table', head: ['函数', '作用'], rows: [
          ['`malloc(n)`', '分配 n 字节，**不清零**'],
          ['`calloc(个数, 大小)`', '分配并**全部清零**'],
          ['`realloc(p, 新大小)`', '调整已分配内存的大小'],
          ['`free(p)`', '释放内存']
        ] },
        { t: 'h', x: '内存泄漏（最常见的问题）' },
        { t: 'p', x: '分配了内存却**忘记 `free`**，叫**内存泄漏**。程序跑得越久，占的内存越多，最后把系统内存耗尽。' },
        { t: 'code', x: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *p = (int *)malloc(5 * sizeof(int));
    if (p == NULL) { printf("分配失败\\n"); return 1; }
    for (int i = 0; i < 5; i++) p[i] = i + 1;
    int sum = 0;
    for (int i = 0; i < 5; i++) sum += p[i];
    printf("和 = %d\\n", sum);
    free(p);      // 用完必须释放
    p = NULL;     // 顺手置空，防止后面误用
    return 0;
}`, out: '和 = 15' },
        { t: 'h', x: 'realloc：动态扩容' },
        { t: 'p', x: '不知道数据有多少时，先分配一小块，满了就用 `realloc` 扩容。这是动态数组的核心技巧。' },
        { t: 'code', x: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *p = (int *)calloc(2, sizeof(int));  // 初始 2 个，值为 0
    p[0] = 10; p[1] = 20;

    int *q = (int *)realloc(p, 4 * sizeof(int));  // 扩容到 4 个
    if (q == NULL) { free(p); return 1; }   // 失败时原内存还在
    p = q;                                   // 用新地址
    p[2] = 30; p[3] = 40;

    for (int i = 0; i < 4; i++) printf("%d ", p[i]);
    printf("\\n");
    free(p);
    return 0;
}`, out: '10 20 30 40' },
        { t: 'h', x: '三个致命错误' },
        { t: 'warn', x: '**野指针**：`free` 之后又使用这块内存，结果不可预测。所以 `free` 后要立刻 `p = NULL`。' },
        { t: 'warn', x: '**重复释放**：对同一块内存 `free` 两次会崩溃。' },
        { t: 'warn', x: '**释放非动态内存**：栈上的数组、局部变量**不能** `free`，只有 `malloc`/`calloc`/`realloc` 出来的才能。' },
        { t: 'tip', x: '口诀：**谁分配谁释放，free 完就置空**。' }
      ],
      examples: [
        { title: '动态数组：满了就翻倍扩容', code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *a = (int *)malloc(2 * sizeof(int));  // 先给 2 个的容量
    int n = 0, cap = 2;
    for (int i = 1; i <= 6; i++) {
        if (n >= cap) {                        // 满了
            cap *= 2;                          // 容量翻倍
            a = (int *)realloc(a, cap * sizeof(int));
        }
        a[n++] = i;
    }
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
    free(a);
    return 0;
}`, note: '这就是「动态数组」的雏形，实际项目里到处可见。' }
      ],
      exercises: [
        {
          id: 'ex-9-2-1', title: '用 malloc 分配并求和', level: 'easy',
          prompt: '用 `malloc` 分配 4 个 `int`，依次赋值为 `2`、`4`、`6`、`8`，求它们的和并打印（记得 `free`）。',
          starter: `#include <stdio.h>
#include <stdlib.h>
int main() {
    // malloc 分配 4 个 int，赋值 2 4 6 8，求和打印
    return 0;
}`,
          hint: '`int *p = malloc(4 * sizeof(int));` 赋值后累加，最后 `printf("%d\\n", sum); free(p);`。',
          tests: [{ stdin: '', expected: '20' }]
        },
        {
          id: 'ex-9-2-2', title: '用 realloc 扩容数组', level: 'mid',
          prompt: '先用 `malloc` 分配 2 个 `int` 存入 `1`、`2`，再用 `realloc` 扩容到 4 个并存入 `3`、`4`，最后打印全部四个元素（空格分隔）。',
          starter: `#include <stdio.h>
#include <stdlib.h>
int main() {
    // malloc 分配 2 个存 1 2，realloc 扩容到 4 个存 3 4，打印
    return 0;
}`,
          hint: '`int *p = malloc(2 * sizeof(int));` 存 1、2；`p = realloc(p, 4 * sizeof(int));` 存 3、4；循环打印。',
          tests: [{ stdin: '', expected: '1 2 3 4' }]
        }
      ]
    },
    {
      id: '9-3',
      title: '错误处理与防御式编程',
      lesson: [
        { t: 'p', x: '真实程序一定会遇到错误：文件打不开、内存分配失败、用户输入了乱七八糟的东西。**生产级代码要主动处理错误**，而不是假装错误不存在。' },
        { t: 'h', x: '检查函数返回值' },
        { t: 'p', x: '很多函数用「特殊返回值」表示失败：`fopen` 失败返回 `NULL`，`malloc` 失败返回 `NULL`，`scanf` 返回成功读入的个数。调用后要检查。' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    FILE *fp = fopen("不存在的文件.txt", "r");
    if (fp == NULL) {
        printf("打开失败，程序安全退出\\n");   // 友好提示 + 安全退出
        return 1;                             // 返回非 0 表示出错
    }
    fclose(fp);
    printf("打开成功\\n");
    return 0;
}`, out: '打开失败，程序安全退出' },
        { t: 'h', x: 'errno 与 strerror：知道「错在哪」' },
        { t: 'p', x: '全局变量 `errno` 记录最近一次系统调用的错误码，`strerror(errno)` 把它翻译成人类可读的描述。' },
        { t: 'code', x: `#include <stdio.h>
#include <errno.h>
#include <string.h>

int main() {
    FILE *fp = fopen("不存在的文件.txt", "r");
    if (fp == NULL) {
        printf("错误码 errno = %d\\n", errno);
        printf("错误描述：%s\\n", strerror(errno));
        return 1;
    }
    fclose(fp);
    return 0;
}`, out: '错误码 errno = 2\n错误描述：No such file or directory' },
        { t: 'h', x: '安全输入：永远别用 gets' },
        { t: 'p', x: '`gets` 不检查缓冲区大小，输入一长就**溢出**，已被 C 标准移除。安全写法是用 `fgets`（限定长度）+ `sscanf`（按格式解析），并检查解析是否成功。' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    char buf[] = "1024 3.5";        // 模拟读进来的一行文本
    int n;
    double f;
    // sscanf 返回成功解析出的值的个数，用它判断输入是否合法
    if (sscanf(buf, "%d %lf", &n, &f) == 2) {
        printf("n=%d, f=%.1f\\n", n, f);
    } else {
        printf("输入格式错误\\n");
    }
    return 0;
}`, out: 'n=1024, f=3.5' },
        { t: 'warn', x: '**防御式编程**的核心思想：永远假设输入、文件、内存都可能出错，对每个可能失败的操作都判断并处理，而不是等程序崩了再查。' },
        { t: 'tip', x: '给用户看的提示要**友好**（"打开文件失败"），给程序员看的调试信息要**具体**（errno、哪一行、什么原因）。' }
      ],
      examples: [
        { title: '用 fgets 安全地读一行', code: `#include <stdio.h>

int main() {
    char line[100];
    // fgets 最多读 99 个字符，不会越界
    if (fgets(line, sizeof(line), stdin) != NULL) {
        printf("读到了：%s", line);
    } else {
        printf("读取失败或到达结尾\\n");
    }
    return 0;
}`, note: '这道题需要输入，在下方「练习」里可以用自动判题测试（提供标准输入）。' }
      ],
      exercises: [
        {
          id: 'ex-9-3-1', title: '用 fgets 安全读入', level: 'easy',
          prompt: '写一个程序，用 `fgets` 从标准输入读入一行字符串（含空格），并把它原样打印出来。',
          starter: `#include <stdio.h>
int main() {
    char line[100];
    // 用 fgets 读一行，再打印
    return 0;
}`,
          hint: '`fgets(line, sizeof(line), stdin);` 后 `printf("%s", line);`。',
          tests: [{ stdin: 'hello world', expected: 'hello world' }, { stdin: 'C 语言', expected: 'C 语言' }]
        },
        {
          id: 'ex-9-3-2', title: '用 fgets + sscanf 解析', level: 'mid',
          prompt: '用 `fgets` 读入一行，再用 `sscanf` 从中解析出两个整数，打印它们的和。',
          starter: `#include <stdio.h>
int main() {
    char line[100];
    // fgets 读一行，sscanf 解析两个整数，打印和
    return 0;
}`,
          hint: '`fgets(line, sizeof(line), stdin); sscanf(line, "%d %d", &a, &b); printf("%d\\n", a + b);`。',
          tests: [{ stdin: '3 5', expected: '8' }, { stdin: '10 20', expected: '30' }]
        }
      ]
    },
    {
      id: '9-4',
      title: '断言与调试',
      lesson: [
        { t: 'p', x: '程序有 bug 是常态。高手和新手的差别，不在「不犯错」，而在**能不能快速定位并修好 bug**。这一节讲三样最实用的调试工具。' },
        { t: 'h', x: '用 assert 抓住「不该发生的事」' },
        { t: 'p', x: '`assert(条件)` 在条件为假时立刻终止程序并打印错误位置。用它验证你的假设，比如「这里除数一定不为 0」「这个下标一定在范围内」。' },
        { t: 'code', x: `#include <stdio.h>
#include <assert.h>

int main() {
    int x = 10;
    assert(x > 0);          // 成立，程序继续
    printf("断言通过，x = %d\\n", x);
    return 0;
}`, out: '断言通过，x = 10' },
        { t: 'code', x: `#include <stdio.h>
#include <assert.h>

int main() {
    int x = -1;
    assert(x > 0);          // 不成立，程序在这里终止并报错
    printf("这行不会执行\\n");
    return 0;
}` },
        { t: 'p', x: '上面的第二个程序运行时，`assert` 会报类似 `Assertion x > 0 failed` 的信息并终止，直接告诉你「在哪、什么条件」挂了。' },
        { t: 'h', x: '编译警告是免费的 bug 探测器' },
        { t: 'p', x: '用 gcc 编译时加上 `-Wall -Wextra`，很多低级 bug（未初始化变量、赋值写成了比较）编译器早就提醒你了。**别忽略警告**。' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    int x = 0;
    if (x = 5) {              // 本意是 x == 5，写成了赋值
        printf("条件成立，x = %d\\n", x);
    }
    return 0;
}`, out: '条件成立，x = 5' },
        { t: 'warn', x: '`if (x = 5)` 是赋值不是比较，**永远为真**。加了 `-Wall` 编译器会警告你「assignment used as truth value」。这是 C 里最经典的 bug 之一。' },
        { t: 'h', x: '调试三板斧' },
        { t: 'ol', x: [
          '**加打印**：在可疑处 `printf` 出变量的值，看它哪一步不对。',
          '**二分缩小**：注释掉一半代码，看 bug 还在不在，逐步锁定范围。',
          '**读报错**：看第一个编译错误/运行错误，抓住「哪一行、什么问题」。'
        ] },
        { t: 'tip', x: '入门阶段，`assert` + `-Wall` 警告 + `printf` 打印这三板斧，就能解决绝大多数 bug。更进阶可以用 `gdb` 单步调试，但那需要本地环境。' }
      ],
      examples: [
        { title: '用 assert 校验参数', code: `#include <stdio.h>
#include <assert.h>

int divide(int a, int b) {
    assert(b != 0);          // 除数为 0 直接报错，避免后续崩溃
    return a / b;
}

int main() {
    printf("%d\\n", divide(10, 2));
    return 0;
}`, note: '在函数入口用 assert 检查参数，是防御式编程的常用手法。' }
      ],
      exercises: [
        {
          id: 'ex-9-4-1', title: '用 assert 断言', level: 'easy',
          prompt: '写一个程序，定义 `int n = 7;`，用 `assert(n > 0)` 断言它是正数，然后打印 `n` 的值。',
          starter: `#include <stdio.h>
#include <assert.h>
int main() {
    int n = 7;
    // 用 assert 断言 n > 0，然后打印 n
    return 0;
}`,
          hint: '`assert(n > 0);` 后 `printf("%d\\n", n);`。',
          tests: [{ stdin: '', expected: '7' }]
        },
        {
          id: 'ex-9-4-2', title: '修复 == 写成 = 的 bug', level: 'mid',
          prompt: '下面的程序本意是判断一个数是否为偶数，但把 `==` 写成了 `=`，无法编译。请修复它：偶数打印 `偶数`，奇数打印 `奇数`。',
          starter: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    if (n % 2 = 0) printf("偶数\\n");   // 这里有 bug，请修复
    else printf("奇数\\n");
    return 0;
}`,
          hint: '判断相等要用 `==`：改成 `if (n % 2 == 0)`。',
          tests: [{ stdin: '4', expected: '偶数' }, { stdin: '7', expected: '奇数' }]
        }
      ]
    },
    {
      id: '9-5',
      title: '位运算与位标志',
      lesson: [
        { t: 'p', x: '位运算直接操作二进制位，在底层开发、嵌入式、权限控制、压缩算法里非常常用。它是 C 语言「贴近硬件」的体现。' },
        { t: 'h', x: '六个位运算符' },
        { t: 'table', head: ['运算符', '含义'], rows: [
          ['`&`', '按位与（两位都为 1 才得 1）'],
          ['`|`', '按位或（任一位为 1 就得 1）'],
          ['`^`', '按位异或（不同为 1，相同为 0）'],
          ['`~`', '按位取反（1 变 0，0 变 1）'],
          ['`<<`', '左移（每移一位相当于乘 2）'],
          ['`>>`', '右移（每移一位相当于除 2）']
        ] },
        { t: 'code', x: `#include <stdio.h>

int main() {
    int a = 10;   // 二进制 1010
    int b = 12;   // 二进制 1100
    printf("a & b = %d\\n", a & b);    // 1000 = 8
    printf("a | b = %d\\n", a | b);    // 1110 = 14
    printf("a ^ b = %d\\n", a ^ b);    // 0110 = 6
    printf("~a = %d\\n", ~a);          // 取反 = -11
    printf("a << 1 = %d\\n", a << 1);  // 10100 = 20
    printf("b >> 1 = %d\\n", b >> 1);  // 110 = 6
    return 0;
}`, out: 'a & b = 8\na | b = 14\na ^ b = 6\n~a = -11\na << 1 = 20\nb >> 1 = 6' },
        { t: 'h', x: '用位标志表示多种开关' },
        { t: 'p', x: '一个 `int` 的每一位可以代表一个开关。用 `|` 设置、`&` 检查、`^` 翻转。比如一个数字表示「读、写、执行」三种权限：' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    int perm = 0;
    int READ = 1, WRITE = 2, EXEC = 4;   // 001 / 010 / 100

    perm = READ | WRITE;                 // 同时设置读、写权限
    printf("perm = %d\\n", perm);        // 3

    if (perm & WRITE) printf("有写权限\\n");
    printf("读权限：%s\\n", (perm & READ) ? "是" : "否");
    printf("执行权限：%s\\n", (perm & EXEC) ? "是" : "否");
    return 0;
}`, out: 'perm = 3\n有写权限\n读权限：是\n执行权限：否' },
        { t: 'h', x: '位掩码：提取某几位' },
        { t: 'p', x: '用 `&` 配合一个「掩码」，可以只提取关心的那几位；用 `^` 可以翻转指定位。' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    int data = 11;   // 二进制 1011
    int mask = 3;    // 二进制 0011（只关心低 2 位）
    printf("低 2 位 = %d\\n", data & mask);   // 3

    data ^= 1;                                // 翻转最低位
    printf("翻转后 = %d\\n", data);           // 1010 = 10
    return 0;
}`, out: '低 2 位 = 3\n翻转后 = 10' },
        { t: 'warn', x: '位运算和逻辑运算**极易混淆**：`&` 是按位与，`&&` 是逻辑与；`|` 是按位或，`||` 是逻辑或。写错一个字符，结果天差地别。' },
        { t: 'tip', x: '`x << 3` 相当于 `x * 8`，`x >> 1` 相当于 `x / 2`。虽然更快，但为了代码可读性，普通场景还是用 `*` `/`，只在性能关键的底层代码里用移位。' }
      ],
      examples: [
        { title: '判断一个数是不是 2 的幂', code: `#include <stdio.h>

int main() {
    int n = 16;
    // 2 的幂的二进制形如 100...0，减 1 后是 011...1，两者按位与为 0
    if (n > 0 && (n & (n - 1)) == 0)
        printf("%d 是 2 的幂\\n", n);
    else
        printf("%d 不是 2 的幂\\n", n);
    return 0;
}`, note: '经典面试题，一行位运算搞定。' }
      ],
      exercises: [
        {
          id: 'ex-9-5-1', title: '位与和位或', level: 'easy',
          prompt: '读入两个整数 `a`、`b`，分别打印 `a & b` 和 `a | b`（中间用空格分隔）。',
          starter: `#include <stdio.h>
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    // 打印 a & b 和 a | b
    return 0;
}`,
          hint: '`printf("%d %d\\n", a & b, a | b);`。',
          tests: [{ stdin: '10 12', expected: '8 14' }, { stdin: '5 3', expected: '1 7' }]
        },
        {
          id: 'ex-9-5-2', title: '判断是否含某个权限位', level: 'mid',
          prompt: '定义权限位 `READ=1`、`WRITE=2`、`EXEC=4`。读入一个整数 `perm`，判断它是否含写权限（WRITE）：含则打印 `有`，否则打印 `无`。',
          starter: `#include <stdio.h>
int main() {
    int WRITE = 2;
    int perm;
    scanf("%d", &perm);
    // 判断 perm 是否含 WRITE 权限，打印 有/无
    return 0;
}`,
          hint: '用 `if (perm & WRITE)` 判断：非 0 表示含该位。',
          tests: [{ stdin: '3', expected: '有' }, { stdin: '4', expected: '无' }]
        }
      ]
    },
    {
      id: '9-6',
      title: '预处理与宏',
      lesson: [
        { t: 'p', x: '以 `#` 开头的指令（`#include`、`#define` 等）在**编译之前**由预处理器处理。理解宏，能帮你写出更简洁、更灵活的代码，也能避开它的坑。' },
        { t: 'h', x: '#define 定义宏' },
        { t: 'p', x: '`#define 名字 替换内容` 是简单的**文本替换**。可以定义常量，也可以定义带参数的「宏函数」。' },
        { t: 'code', x: `#include <stdio.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))   // 宏函数
#define PI 3.14159                          // 常量

int main() {
    printf("MAX(3, 7) = %d\\n", MAX(3, 7));
    printf("PI 的平方 = %.2f\\n", PI * PI);
    return 0;
}`, out: 'MAX(3, 7) = 7\nPI 的平方 = 9.87' },
        { t: 'h', x: '宏最大的坑：参数要加括号' },
        { t: 'p', x: '宏是纯文本替换，不做任何计算。如果不加括号，`SQR(1+2)` 会被替换成 `1+2*1+2`，结果完全错误。' },
        { t: 'code', x: `#include <stdio.h>

#define SQR(x) (x * x)          // 危险写法
#define SQR2(x) ((x) * (x))     // 安全写法

int main() {
    printf("SQR(1+2) = %d\\n", SQR(1+2));    // 1+2*1+2 = 5
    printf("SQR2(1+2) = %d\\n", SQR2(1+2));  // 3*3 = 9
    return 0;
}`, out: 'SQR(1+2) = 5\nSQR2(1+2) = 9' },
        { t: 'h', x: '宏与函数的区别' },
        { t: 'table', head: ['对比项', '宏', '函数'], rows: [
          ['本质', '文本替换', '真正的调用'],
          ['类型检查', '无', '有'],
          ['求值次数', '参数可能被求值多次', '只求值一次'],
          ['运行开销', '无调用开销', '有调用开销']
        ] },
        { t: 'h', x: '条件编译' },
        { t: 'p', x: '`#ifdef` / `#ifndef` / `#endif` 让编译器**按条件选择编译哪段代码**，常用于调试开关和跨平台代码。' },
        { t: 'code', x: `#include <stdio.h>

#define DEBUG 1     // 改成 0 或删掉，就会走 else 分支

int main() {
    #ifdef DEBUG
        printf("调试模式：x = %d\\n", 42);
    #else
        printf("正式模式\\n");
    #endif
    printf("正常运行\\n");
    return 0;
}`, out: '调试模式：x = 42\n正常运行' },
        { t: 'p', x: '之前学的头文件保护 `#ifndef XXX_H ... #endif`，其实就是条件编译的应用——第二次包含时 `XXX_H` 已定义，中间的内容就被跳过。' },
        { t: 'tip', x: '能用 `const` 或普通函数表达清楚的，优先用它们；宏只在「需要文本替换」或「跨平台/调试开关」等少数场景用，并记得给参数加括号。' }
      ],
      examples: [
        { title: '用宏定义常量 + 调试开关', code: `#include <stdio.h>

#define MAX_STUDENTS 50
#define DEBUG 1

int main() {
    #ifdef DEBUG
        printf("调试：学生上限 %d\\n", MAX_STUDENTS);
    #endif
    printf("程序结束\\n");
    return 0;
}`, note: '发布正式版时删掉 `#define DEBUG 1`，调试代码就自动不编译了。' }
      ],
      exercises: [
        {
          id: 'ex-9-6-1', title: '用宏定义常量', level: 'easy',
          prompt: '用 `#define` 定义常量 `N` 为 `10`，打印 `N` 的平方（直接写 `N * N`）。',
          starter: `#include <stdio.h>
int main() {
    // #define N 10，打印 N * N
    return 0;
}`,
          hint: '`#define N 10` 放在 include 之后，然后 `printf("%d\\n", N * N);`。',
          tests: [{ stdin: '', expected: '100' }]
        },
        {
          id: 'ex-9-6-2', title: '定义带参数宏', level: 'mid',
          prompt: '定义宏 `SQR(x) ((x) * (x))`，读入一个整数 `n`，打印 `SQR(n)`。',
          starter: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    // 定义宏 SQR(x)，打印 SQR(n)
    return 0;
}`,
          hint: '`#define SQR(x) ((x) * (x))`，然后 `printf("%d\\n", SQR(n));`。',
          tests: [{ stdin: '4', expected: '16' }, { stdin: '7', expected: '49' }]
        }
      ]
    }
  ],
  quiz: {
    title: '第九章 · 实践题',
    code: [
      {
        title: '用宏求立方', level: 'easy',
        prompt: '定义宏 `CUBE(x) ((x) * (x) * (x))`，读入一个整数 `n`，打印 `CUBE(n)`。',
        starter: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    // 定义宏 CUBE(x)，打印 CUBE(n)
    return 0;
}`,
        answer: `#include <stdio.h>
#define CUBE(x) ((x) * (x) * (x))
int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", CUBE(n));
    return 0;
}`,
        explain: '`#define CUBE(x) ((x)*(x)*(x))` 定义宏，参数加括号防止运算顺序出错。',
        tests: [{ stdin: '3', expected: '27' }, { stdin: '4', expected: '64' }]
      },
      {
        title: '安全读取并解析两数求和', level: 'mid',
        prompt: '用 `fgets` 读入一行字符串，再用 `sscanf` 从中解析出两个整数，打印它们的和。',
        starter: `#include <stdio.h>
int main() {
    char line[100];
    // fgets 读一行，sscanf 解析两个整数，打印和
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    char line[100];
    int a, b;
    if (fgets(line, sizeof(line), stdin) != NULL && sscanf(line, "%d %d", &a, &b) == 2)
        printf("%d\\n", a + b);
    return 0;
}`,
        explain: '`fgets` 安全读入一行（不会越界），`sscanf` 按格式解析两个整数，检查返回值确认解析成功。',
        tests: [{ stdin: '3 5', expected: '8' }, { stdin: '10 20', expected: '30' }]
      },
      {
        title: '动态分配并求和', level: 'mid',
        prompt: '读入一个整数 `n`（不超过 100），用 `malloc` 分配一个含 `n` 个 `int` 的数组，再读入 `n` 个数存入数组，输出它们的和（记得 `free`）。',
        starter: `#include <stdio.h>
#include <stdlib.h>
int main() {
    int n;
    scanf("%d", &n);
    // malloc 分配 n 个 int，读入并求和，最后 free
    return 0;
}`,
        answer: `#include <stdio.h>
#include <stdlib.h>
int main() {
    int n;
    scanf("%d", &n);
    int *p = (int *)malloc(n * sizeof(int));
    if (p == NULL) return 1;
    int sum = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &p[i]);
        sum += p[i];
    }
    printf("%d\\n", sum);
    free(p);
    return 0;
}`,
        explain: '先读 n，malloc 分配数组；循环读入并累加；打印和；最后 free 释放，避免内存泄漏。',
        tests: [{ stdin: '5\n1 2 3 4 5', expected: '15' }, { stdin: '3\n10 20 30', expected: '60' }]
      },
      {
        title: '动态数组：读入并倒序输出', level: 'hard',
        prompt: '用 `malloc` 先分配 2 个 `int` 的数组，反复读入整数直到读到 `0`（`0` 不存入），每次容量不够就用 `realloc` 翻倍扩容；最后**倒序**打印所有存入的整数（空格分隔），记得 `free`。',
        starter: `#include <stdio.h>
#include <stdlib.h>
int main() {
    // 动态数组：读入到 0 为止，realloc 扩容，倒序打印
    return 0;
}`,
        answer: `#include <stdio.h>
#include <stdlib.h>
int main() {
    int *a = (int *)malloc(2 * sizeof(int));
    int n = 0, cap = 2, x;
    while (scanf("%d", &x) == 1 && x != 0) {
        if (n >= cap) { cap *= 2; a = (int *)realloc(a, cap * sizeof(int)); }
        a[n++] = x;
    }
    for (int i = n - 1; i >= 0; i--) printf("%d ", a[i]);
    printf("\\n");
    free(a);
    return 0;
}`,
        explain: '用 `n` 记录已存个数、`cap` 记录容量；满则翻倍 `realloc`。存完后从后往前打印即倒序，最后 free。',
        tests: [{ stdin: '1 2 3 4 5 0', expected: '5 4 3 2 1' }, { stdin: '10 20 30 0', expected: '30 20 10' }]
      },
      {
        title: '位标志判断三种权限', level: 'hard',
        prompt: '定义 `READ=1`、`WRITE=2`、`EXEC=4`。读入一个整数 `perm`，按「读、写、执行」的顺序，对每个权限判断是否拥有，拥有打印 `有`，否则打印 `无`（共三行）。',
        starter: `#include <stdio.h>
int main() {
    int READ = 1, WRITE = 2, EXEC = 4;
    int perm;
    scanf("%d", &perm);
    // 依次判断 READ / WRITE / EXEC，各打印一行 有/无
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int READ = 1, WRITE = 2, EXEC = 4;
    int perm;
    scanf("%d", &perm);
    printf("%s\\n", (perm & READ) ? "有" : "无");
    printf("%s\\n", (perm & WRITE) ? "有" : "无");
    printf("%s\\n", (perm & EXEC) ? "有" : "无");
    return 0;
}`,
        explain: '用按位与 `&` 检查每一位：`perm & READ` 非 0 表示含读权限。三行分别判断三种权限。',
        tests: [{ stdin: '3', expected: '有\n有\n无' }, { stdin: '5', expected: '有\n无\n有' }]
      }
    ]
  }
});
