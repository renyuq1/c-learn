/* 第六章 · 指针 */
window.COURSE.push({
  id: 'ch6',
  title: '指针',
  icon: '🎯',
  intro: 'C 语言最强大的武器——指针：直接操作内存地址，理解程序底层。',
  chapters: [
    {
      id: '6-1',
      title: '指针的概念与定义',
      lesson: [
        { t: 'p', x: '**指针**是 C 语言里最核心、也最让人「又爱又怕」的概念。别慌，一句话就能懂：**指针是用来存「地址」的变量**。' },
        { t: 'p', x: '每个变量都住在内存里，有个「门牌号」叫**地址**。普通变量存的是「值」，而指针变量存的是「某个变量的地址」。通过指针，我们能间接地访问和修改那个变量。' },
        { t: 'h', x: '两个关键运算符' },
        { t: 'list', x: [
          '`&`：**取地址**。`&x` 得到变量 x 的地址。',
          '`*`：**解引用**。`*p` 表示「p 指向的那个变量」本身。'
        ] },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int x = 10;
    int *p = &x;      // p 存了 x 的地址（p 是指向 int 的指针）

    printf("x 的值 = %d\\n", x);
    printf("p 指向的值 = %d\\n", *p);   // 解引用，得到 10

    *p = 20;          // 通过指针修改 x
    printf("修改后 x = %d\\n", x);
    return 0;
}`, out: 'x 的值 = 10\np 指向的值 = 10\n修改后 x = 20' },
        { t: 'h', x: '指针的声明' },
        { t: 'p', x: '`int *p;` 读作「p 是一个指向 int 的指针」。`*` 写在类型后面、变量前面。' },
        { t: 'warn', x: '指针必须先**指向某个有效的地址**才能解引用。未初始化的指针指向哪里谁也不知道，解引用会导致程序崩溃。' },
        { t: 'tip', x: '记忆口诀：`&` 取地址，`*` 解引用（取指针指向的内容）。这两个正好是一对「相反」的操作。' }
      ],
      examples: [
        { title: '打印变量的地址', code: `#include <stdio.h>
int main() {
    int x = 10;
    int *p = &x;
    printf("x 的地址是 %p\\n", (void*)p);
    printf("x 的值是 %d\\n", *p);
    return 0;
}`, note: '`%p` 用来打印地址（十六进制），每次运行地址可能不同。' }
      ]
    },
    {
      id: '6-2',
      title: '指针与数组',
      lesson: [
        { t: 'p', x: '指针和数组关系密切：**数组名本身就是指向首元素的指针**。可以用指针来遍历数组，而且往往更快。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a[5] = {10, 20, 30, 40, 50};
    int *p = a;          // a 就是 &a[0]

    for (int i = 0; i < 5; i++) {
        printf("%d ", *(p + i));   // 等价于 a[i]
    }
    printf("\\n");
    return 0;
}`, out: '10 20 30 40 50' },
        { t: 'h', x: '指针运算' },
        { t: 'p', x: '指针加 1，不是地址加 1 个字节，而是「**往后移一个元素**」。`p + 1` 指向下一个元素，`*(p + i)` 等价于 `p[i]`。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a[3] = {1, 2, 3};
    int *p = a;

    printf("%d\\n", *p);      // a[0] = 1
    p++;                      // 指向下一个元素
    printf("%d\\n", *p);      // a[1] = 2
    return 0;
}`, out: '1\n2' },
        { t: 'warn', x: '指针移动时别越界。`p` 最多能移到 `a[n-1]`，再往前就是非法内存。' },
        { t: 'tip', x: '`a[i]`、`*(a+i)`、`*(p+i)`、`p[i]` 四种写法访问同一个元素，可以互相替换。' }
      ],
      examples: [
        { title: '用指针求数组和', code: `#include <stdio.h>
int main() {
    int a[5] = {3, 7, 2, 9, 5};
    int *p = a;
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += *(p + i);
    }
    printf("和 = %d\\n", sum);
    return 0;
}`, note: '用指针遍历数组并累加。' }
      ]
    },
    {
      id: '6-3',
      title: '指针与字符串',
      lesson: [
        { t: 'p', x: '在 C 里，字符串本质上就是字符数组，而指向字符串的指针就是**字符指针** `char *`。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    char *s = "Hello";   // s 指向字符串常量的首地址
    printf("%s\\n", s);

    // 用指针遍历字符串，直到遇到 \\0
    for (char *p = s; *p != '\\0'; p++) {
        printf("%c ", *p);
    }
    printf("\\n");
    return 0;
}`, out: 'Hello\nH e l l o' },
        { t: 'h', x: '字符数组 vs 字符指针' },
        { t: 'table', head: ['写法', '性质'], rows: [
          ['`char s[] = "Hello";`', '数组，内容**可修改**'],
          ['`char *s = "Hello";`', '指针指向字符串常量，内容**通常不可修改**']
        ] },
        { t: 'warn', x: '`char *s = "Hello";` 指向的是字符串常量（只读），对它修改（如 `s[0] = \'h\'`）是未定义行为，可能崩溃。要可修改的字符串，用字符数组。' },
        { t: 'note', x: '`char *argv[]`（main 的命令行参数）就是字符指针数组，是「指针与字符串」的一个常见应用。' }
      ],
      examples: [
        { title: '计算字符串长度（自己实现 strlen）', code: `#include <stdio.h>

int my_strlen(char *s) {
    int n = 0;
    while (*s != '\\0') {
        n++;
        s++;
    }
    return n;
}

int main() {
    printf("%d\\n", my_strlen("hello"));
    return 0;
}`, note: '指针逐个后移直到 `\\0`，数出字符个数。' }
      ]
    },
    {
      id: '6-4',
      title: '指针与函数',
      lesson: [
        { t: 'p', x: '指针和函数配合，能解决一个关键问题：**让函数修改调用处的变量**。还记得前面说「形参是值传递、改不动实参」吗？用指针就能改。' },
        { t: 'h', x: '指针参数：交换两个数' },
        { t: 'code', x: `#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int main() {
    int x = 3, y = 5;
    swap(&x, &y);        // 传地址
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`, out: 'x=5 y=3' },
        { t: 'p', x: '这里传的是 `&x`、`&y`（地址），函数里通过 `*a`、`*b` 直接操作原变量，所以交换真正生效了。' },
        { t: 'h', x: '函数指针' },
        { t: 'p', x: 'C 还支持**函数指针**——把函数本身当成值来传递，用于回调、选择不同算法等：' },
        { t: 'code', x: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int main() {
    int (*op)(int, int);   // 声明一个函数指针
    op = add;
    printf("%d\\n", op(3, 5));   // 8
    op = mul;
    printf("%d\\n", op(3, 5));   // 15
    return 0;
}`, out: '8\n15' },
        { t: 'warn', x: '传给指针参数的必须是**地址**（如 `&x` 或数组名），不是值。`swap(x, y)` 这种写法是错的。' },
        { t: 'tip', x: '想「让函数改哪个变量」，就把哪个变量的地址传进去。这是指针最实用的场景之一。' }
      ],
      examples: [
        { title: '用指针返回多个结果', code: `#include <stdio.h>

// 同时返回两个数的和与差
void calc(int a, int b, int *sum, int *diff) {
    *sum = a + b;
    *diff = a - b;
}

int main() {
    int s, d;
    calc(10, 4, &s, &d);
    printf("和=%d 差=%d\\n", s, d);
    return 0;
}`, note: '一个函数通过指针「输出」多个值。' }
      ]
    },
    {
      id: '6-5',
      title: '多级指针与指针数组',
      lesson: [
        { t: 'p', x: '指针本身也是一个变量，也有地址，于是可以有「指向指针的指针」——**二级指针** `int **pp`。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int x = 10;
    int *p = &x;      // 一级指针
    int **pp = &p;    // 二级指针，存 p 的地址

    printf("%d\\n", **pp);   // 两次解引用，得到 10
    **pp = 30;
    printf("%d\\n", x);      // 30
    return 0;
}`, out: '10\n30' },
        { t: 'h', x: '指针数组' },
        { t: 'p', x: '数组里存的都是指针，就是**指针数组**。最典型的是存多个字符串：' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    char *names[] = {"Alice", "Bob", "Cindy"};   // 指针数组

    for (int i = 0; i < 3; i++) {
        printf("%s\\n", names[i]);
    }
    return 0;
}`, out: 'Alice\nBob\nCindy' },
        { t: 'h', x: '区分两个容易混的写法' },
        { t: 'list', x: [
          '`int *a[10];`：**指针数组**（10 个元素，每个是指针）。',
          '`int (*a)[10];`：**数组指针**（指向一个含 10 个 int 的数组）。'
        ] },
        { t: 'tip', x: '二级指针常用于动态分配二维数组、函数里修改指针本身等进阶场景，先看懂 `**pp` 的含义即可。' }
      ],
      examples: [
        { title: '遍历命令行风格的字符串数组', code: `#include <stdio.h>
int main() {
    char *week[] = {"周一", "周二", "周三", "周四", "周五"};
    int n = sizeof(week) / sizeof(week[0]);
    for (int i = 0; i < n; i++) {
        printf("%s ", week[i]);
    }
    printf("\\n");
    return 0;
}`, note: '用 sizeof 算出数组长度，再用指针数组遍历。' }
      ]
    }
  ],
  quiz: {
    title: '第六章 · 训练题',
    choice: [
      { q: '指针变量里存的是？', options: ['某个变量的值', '某个变量的地址', '一个整数常量', '字符串'], answer: 1, explain: '指针存的是地址。' },
      { q: '`int *p = &x;` 中，`*p` 表示？', options: ['x 的地址', 'p 的地址', 'x 的值', 'p 本身'], answer: 2, explain: '`*p` 是解引用，表示 p 指向的变量 x 的值。' },
      { q: '取变量 `x` 的地址，写法是？', options: ['`*x`', '`&x`', '`x`', '`%x`'], answer: 1, explain: '`&` 是取地址运算符。' },
      { q: '`int a[5]`，那么 `a` 等价于？', options: ['`&a[0]`', '`a[0]`', '`*a[0]`', '`a[5]`'], answer: 0, explain: '数组名 a 就是首元素 a[0] 的地址。' },
      { q: '通过指针让函数修改调用处变量，应该传什么？', options: ['变量的值', '变量的地址', '变量的类型', '什么都不传'], answer: 1, explain: '传地址（&x），函数里解引用修改。' },
      { q: '`char *names[] = {"A", "B"};` 里 `names` 是？', options: ['字符数组', '指针数组', '二级指针变量', '字符串'], answer: 1, explain: '`names` 是指针数组，每个元素指向一个字符串。' }
    ],
    fill: [
      { q: '声明一个指向整数的指针变量 `p`，写法是 `int ____p;`。', answer: '*', explain: '`int *p;` 中 `*` 表示 p 是指针。' },
      { q: '通过指针 `p` 访问它指向的变量，用运算符 `____`。', answer: '*', explain: '`*p` 是解引用，得到指向的变量。' },
      { q: '二级指针 `int **pp` 中，`**pp` 表示 pp 指向的指针所指向的变量的 `____`。', answer: '值', accept: ['内容', '数值'], explain: '`**pp` 两次解引用，得到最终变量的值。' }
    ],
    code: [
      {
        title: '用指针交换两个数', level: 'mid',
        prompt: '定义一个 `swap(int *a, int *b)` 函数交换两个整数，`main` 读入两个整数后调用它，输出交换后的结果。',
        starter: `#include <stdio.h>

void swap(int *a, int *b) {
    // 完成交换
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    swap(&x, &y);
    printf("%d %d\\n", x, y);
    return 0;
}`,
        answer: `#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    swap(&x, &y);
    printf("%d %d\\n", x, y);
    return 0;
}`,
        explain: '用临时变量 t，通过指针解引用交换两个值。',
        tests: [{ stdin: '3 5', expected: '5 3' }, { stdin: '100 1', expected: '1 100' }]
      },
      {
        title: '用指针求数组最大值', level: 'hard',
        prompt: '读入 `n`（1 ≤ n ≤ 100）和 n 个整数，用指针遍历数组，输出最大值。',
        starter: `#include <stdio.h>
int main() {
    int n, a[100];
    // 读入数据，用指针找最大值输出
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    int max = *a;
    for (int *p = a + 1; p < a + n; p++) {
        if (*p > max) max = *p;
    }
    printf("%d\\n", max);
    return 0;
}`,
        explain: '让指针 p 从 a+1 开始逐个后移，比较 *p 更新最大值。',
        tests: [{ stdin: '5\n3 9 2 7 5', expected: '9' }, { stdin: '4\n-1 -5 -3 -2', expected: '-1' }]
      }
    ]
  }
});
