/* 第四章 · 数组 */
window.COURSE.push({
  id: 'ch4',
  title: '数组',
  icon: '📦',
  intro: '用数组批量存储同类型数据，处理字符串，并学会排序与查找。',
  chapters: [
    {
      id: '4-1',
      title: '一维数组',
      lesson: [
        { t: 'p', x: '假设要存一个班 50 个人的成绩，声明 50 个变量太累了。**数组**可以一口气存多个**同类型**的数据，用下标（编号）访问每一个。' },
        { t: 'h', x: '声明与使用' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int score[5];          // 声明一个能存 5 个整数的数组
    score[0] = 90;         // 下标从 0 开始！
    score[1] = 85;
    score[2] = 78;
    score[3] = 92;
    score[4] = 88;

    printf("第 1 个人的成绩是 %d\\n", score[0]);
    return 0;
}`, out: '第 1 个人的成绩是 90' },
        { t: 'warn', x: '数组下标从 **0** 开始！`score[5]` 里的元素是 `score[0]` 到 `score[4]`，没有 `score[5]`。访问越界是危险 bug。' },
        { t: 'h', x: '初始化' },
        { t: 'p', x: '声明时可以直接给初值：`int a[3] = {10, 20, 30};`。也可以不给长度让编译器数：`int a[] = {10, 20, 30};`。' },
        { t: 'h', x: '用循环遍历数组' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a[5] = {10, 20, 30, 40, 50};
    for (int i = 0; i < 5; i++) {
        printf("a[%d] = %d\\n", i, a[i]);
    }
    return 0;
}`, out: 'a[0] = 10\na[1] = 20\na[2] = 30\na[3] = 40\na[4] = 50' },
        { t: 'tip', x: '数组和循环是天生一对：用循环变量当下标，就能一个个访问所有元素。' }
      ],
      examples: [
        { title: '求数组元素的和', code: `#include <stdio.h>
int main() {
    int a[5] = {3, 7, 2, 9, 5};
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += a[i];
    }
    printf("总和 = %d\\n", sum);
    return 0;
}`, note: '循环累加每个元素。' }
      ],
      exercises: [
        {
          id: 'ex-4-1-1', title: '读入 5 个数求和', level: 'easy',
          prompt: '读入 5 个整数存入数组，输出它们的和（末尾换行）。',
          starter: `#include <stdio.h>
int main() {
    int a[5], sum = 0;
    // 读入 5 个数并求和输出
    return 0;
}`,
          hint: '`for (int i = 0; i < 5; i++) { scanf("%d", &a[i]); sum += a[i]; }`。',
          tests: [{ stdin: '1 2 3 4 5', expected: '15' }, { stdin: '10 20 30 40 50', expected: '150' }]
        },
        {
          id: 'ex-4-1-2', title: '逆序输出数组', level: 'easy',
          prompt: '读入 5 个整数存入数组，然后**逆序**输出它们（每个后面一个空格）。',
          starter: `#include <stdio.h>
int main() {
    int a[5];
    // 读入 5 个数，逆序输出
    return 0;
}`,
          hint: '先读入，再从 `i = 4` 到 `0` 倒着打印 `a[i]`。',
          tests: [{ stdin: '1 2 3 4 5', expected: '5 4 3 2 1' }, { stdin: '9 8 7 6 5', expected: '5 6 7 8 9' }]
        },
        {
          id: 'ex-4-1-3', title: '求数组最大值', level: 'mid',
          prompt: '读入 5 个整数存入数组，输出其中的最大值。',
          starter: `#include <stdio.h>
int main() {
    int a[5];
    // 读入 5 个数，找最大值输出
    return 0;
}`,
          hint: '先假设 `a[0]` 最大，再逐个比较更新。',
          tests: [{ stdin: '3 9 2 7 5', expected: '9' }, { stdin: '-1 -5 -3 -2 -8', expected: '-1' }]
        }
      ]
    },
    {
      id: '4-2',
      title: '二维数组',
      lesson: [
        { t: 'p', x: '二维数组可以理解成「表格」——有行和列。声明：`int a[行数][列数];`。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a[2][3] = {
        {1, 2, 3},   // 第 0 行
        {4, 5, 6}    // 第 1 行
    };
    printf("%d\\n", a[1][2]);   // 第 1 行第 2 列，是 6
    return 0;
}`, out: '6' },
        { t: 'h', x: '用双重循环遍历' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a[3][3] = {{1,2,3},{4,5,6},{7,8,9}};
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", a[i][j]);
        }
        printf("\\n");   // 每行结束换行
    }
    return 0;
}`, out: '1 2 3\n4 5 6\n7 8 9' },
        { t: 'p', x: '二维数组常见用途：表示矩阵、地图、成绩单（每行一个学生的各科成绩）。' },
        { t: 'tip', x: '记住「先行后列」：`a[i][j]` 里 `i` 是行号，`j` 是列号。' }
      ],
      examples: [
        { title: '计算矩阵每行的和', code: `#include <stdio.h>
int main() {
    int a[3][3] = {{1,2,3},{4,5,6},{7,8,9}};
    for (int i = 0; i < 3; i++) {
        int sum = 0;
        for (int j = 0; j < 3; j++) sum += a[i][j];
        printf("第 %d 行和 = %d\\n", i, sum);
    }
    return 0;
}`, note: '外层循环每行，内层循环累加该行。' }
      ],
      exercises: [
        {
          id: 'ex-4-2-1', title: '矩阵元素求和', level: 'easy',
          prompt: '有一个 `3×3` 矩阵 `{{1,2,3},{4,5,6},{7,8,9}}`，用双重循环求出所有元素之和并输出。',
          starter: `#include <stdio.h>
int main() {
    int a[3][3] = {{1,2,3},{4,5,6},{7,8,9}};
    // 计算所有元素之和并输出
    return 0;
}`,
          hint: '双重循环累加 `a[i][j]`，1~9 的和是 45。',
          tests: [{ stdin: '', expected: '45' }]
        },
        {
          id: 'ex-4-2-2', title: '主对角线元素和', level: 'mid',
          prompt: '求 `3×3` 矩阵 `{{1,2,3},{4,5,6},{7,8,9}}` 的**主对角线**（`i == j`）元素之和。',
          starter: `#include <stdio.h>
int main() {
    int a[3][3] = {{1,2,3},{4,5,6},{7,8,9}};
    // 计算主对角线元素之和
    return 0;
}`,
          hint: '主对角线是 `a[0][0] + a[1][1] + a[2][2] = 1+5+9 = 15`。',
          tests: [{ stdin: '', expected: '15' }]
        },
        {
          id: 'ex-4-2-3', title: '打印矩阵', level: 'mid',
          prompt: '打印 `3×3` 矩阵 `{{1,2,3},{4,5,6},{7,8,9}}`，每行 3 个数、每行结束后换行。',
          starter: `#include <stdio.h>
int main() {
    int a[3][3] = {{1,2,3},{4,5,6},{7,8,9}};
    // 按 3 行 3 列打印矩阵
    return 0;
}`,
          hint: '内层循环打印 `a[i][j]` 后，外层每轮结束 `printf("\\n");`。',
          tests: [{ stdin: '', expected: '1 2 3\n4 5 6\n7 8 9' }]
        }
      ]
    },
    {
      id: '4-3',
      title: '字符数组与字符串',
      lesson: [
        { t: 'p', x: 'C 语言没有专门的「字符串」类型，字符串是用**字符数组**来存的。字符串有一个重要约定：**以 `\\0`（空字符）结尾**，这样程序才知道它在哪里结束。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    char name[10] = "Alice";   // 字符串，末尾自动有 \\0
    char word[] = {'H','i','\\0'};

    printf("%s\\n", name);     // 用 %s 打印字符串
    printf("%s\\n", word);
    return 0;
}`, out: 'Alice\nHi' },
        { t: 'h', x: '字符串的几个要点' },
        { t: 'list', x: [
          '用双引号 `"..."` 括起来的是字符串，会自动在末尾加 `\\0`。',
          '打印字符串用占位符 `%s`。',
          '字符数组的长度要**足够容纳字符串 + 结尾的 `\\0`**。比如 `"Alice"` 需要 6 个字节（5 个字符 + 1 个 `\\0`）。'
        ] },
        { t: 'h', x: '用 scanf 读字符串' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    char name[20];
    scanf("%s", name);       // 注意：字符串不需要加 & 号
    printf("你好，%s\\n", name);
    return 0;
}` },
        { t: 'warn', x: '`scanf("%s", ...)` 读到**空格或换行就停**，所以不能读带空格的字符串；而且数组名本身是地址，**不用加 `&`**。' },
        { t: 'note', x: '数组名（如 `name`）本身代表数组首元素的地址，所以 `scanf("%s", name)` 不用写 `&name`。这和普通变量 `scanf("%d", &n)` 不一样。' }
      ],
      examples: [
        { title: '逐个字符打印字符串', code: `#include <stdio.h>
int main() {
    char s[] = "hello";
    for (int i = 0; s[i] != '\\0'; i++) {
        printf("%c", s[i]);
    }
    printf("\\n");
    return 0;
}`, note: '循环到 `\\0` 就停，这就是遍历字符串的标准写法。' }
      ],
      exercises: [
        {
          id: 'ex-4-3-1', title: '读入并打印字符串', level: 'easy',
          prompt: '读入一个不含空格的字符串，原样打印它（末尾换行）。',
          starter: `#include <stdio.h>
int main() {
    char s[100];
    // 读入字符串并打印
    return 0;
}`,
          hint: '`scanf("%s", s);`（字符串不用 `&`），`printf("%s\\n", s);`。',
          tests: [{ stdin: 'hello', expected: 'hello' }, { stdin: 'world', expected: 'world' }]
        },
        {
          id: 'ex-4-3-2', title: '计算字符串长度', level: 'mid',
          prompt: '读入一个字符串，用循环数出它的字符个数（遇到 `\\0` 停止），并输出。',
          starter: `#include <stdio.h>
int main() {
    char s[100];
    // 读入字符串，数出长度输出
    return 0;
}`,
          hint: '`for (int i = 0; s[i] != \'\\0\'; i++)` 计数。',
          tests: [{ stdin: 'hello', expected: '5' }, { stdin: 'abc', expected: '3' }]
        },
        {
          id: 'ex-4-3-3', title: '打印第一个字符', level: 'easy',
          prompt: '读入一个字符串，用 `%c` 打印它的第一个字符。',
          starter: `#include <stdio.h>
int main() {
    char s[100];
    // 读入字符串，打印第一个字符
    return 0;
}`,
          hint: '第一个字符是 `s[0]`，用 `printf("%c\\n", s[0]);`。',
          tests: [{ stdin: 'hello', expected: 'h' }, { stdin: 'cat', expected: 'c' }]
        }
      ]
    },
    {
      id: '4-4',
      title: '常用字符串函数',
      lesson: [
        { t: 'p', x: '处理字符串是常事，C 提供了 `string.h` 里的一批函数，不用自己从头写。使用前先 `#include <string.h>`。' },
        { t: 'h', x: '四个最常用的函数' },
        { t: 'table', head: ['函数', '作用', '例子'], rows: [
          ['`strlen(s)`', '求字符串长度（不含 `\\0`）', '`strlen("hi")` → 2'],
          ['`strcpy(d, s)`', '把 s 复制到 d', '`strcpy(d, "abc")`'],
          ['`strcat(d, s)`', '把 s 接到 d 后面', '`strcat(d, "!")`'],
          ['`strcmp(a, b)`', '比较两个字符串，相等返回 0', '`strcmp(a, b) == 0`']
        ] },
        { t: 'code', x: `#include <stdio.h>
#include <string.h>
int main() {
    char s[30] = "Hello";
    printf("长度是 %d\\n", (int)strlen(s));

    strcat(s, " World");      // 拼接
    printf("%s\\n", s);

    if (strcmp(s, "Hello World") == 0) {
        printf("字符串相等\\n");
    }
    return 0;
}`, out: '长度是 5\nHello World\n字符串相等' },
        { t: 'warn', x: '`strcmp` 相等时返回的是 **0**（不是 1）。很多新手写 `if (strcmp(a,b))` 以为相等，其实反了。' },
        { t: 'warn', x: '`strcpy`/`strcat` 的目标数组要**足够大**，否则会写越界，导致程序崩溃或数据损坏。' },
        { t: 'tip', x: '`strlen` 返回的类型是 `size_t`，打印时最好转成 `(int)`，避免某些编译器警告。' }
      ],
      examples: [
        { title: '复制并拼接字符串', code: `#include <stdio.h>
#include <string.h>
int main() {
    char a[50];
    strcpy(a, "I love");
    strcat(a, " C");
    printf("%s\\n", a);
    return 0;
}`, note: '先用 strcpy 初始化，再用 strcat 拼接。' }
      ],
      exercises: [
        {
          id: 'ex-4-4-1', title: '用 strlen 求长度', level: 'easy',
          prompt: '读入一个字符串，用 `strlen` 求出它的长度并输出（记得 `#include <string.h>`）。',
          starter: `#include <stdio.h>
#include <string.h>
int main() {
    char s[100];
    // 读入字符串，用 strlen 求长度输出
    return 0;
}`,
          hint: '`printf("%d\\n", (int)strlen(s));`。',
          tests: [{ stdin: 'hello', expected: '5' }, { stdin: 'computer', expected: '8' }]
        },
        {
          id: 'ex-4-4-2', title: '用 strcat 拼接', level: 'easy',
          prompt: '有一个字符串 `char s[50] = "Hello";`，用 `strcat` 在它后面接上 `" World"`，然后打印。',
          starter: `#include <stdio.h>
#include <string.h>
int main() {
    char s[50] = "Hello";
    // 用 strcat 拼接并输出
    return 0;
}`,
          hint: '`strcat(s, " World"); printf("%s\\n", s);`。',
          tests: [{ stdin: '', expected: 'Hello World' }]
        },
        {
          id: 'ex-4-4-3', title: '用 strcmp 比较', level: 'mid',
          prompt: '读入两个字符串 `a`、`b`，如果相等输出 `相等`，否则输出 `不相等`。',
          starter: `#include <stdio.h>
#include <string.h>
int main() {
    char a[100], b[100];
    // 读入两个字符串，判断是否相等
    return 0;
}`,
          hint: '`if (strcmp(a, b) == 0)` 表示相等（注意相等返回 0）。',
          tests: [{ stdin: 'abc abc', expected: '相等' }, { stdin: 'abc abd', expected: '不相等' }]
        }
      ]
    },
    {
      id: '4-5',
      title: '排序与查找',
      lesson: [
        { t: 'p', x: '排序和查找是最基础的算法，也是以后做任何「数据处理」的必备技能。' },
        { t: 'h', x: '冒泡排序' },
        { t: 'p', x: '冒泡排序的思路：相邻两个元素比较，把大的往后「冒」，一轮下来最大的沉到最后，重复多轮就排好了。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a[] = {5, 2, 8, 1, 9};
    int n = 5;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
        }
    }
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
    return 0;
}`, out: '1 2 5 8 9' },
        { t: 'h', x: '线性查找' },
        { t: 'p', x: '从头到尾一个个找，找到了就停，返回下标；找不到返回 -1。' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    int a[] = {3, 7, 2, 9, 5};
    int n = 5, target = 9;
    int index = -1;
    for (int i = 0; i < n; i++) {
        if (a[i] == target) { index = i; break; }
    }
    printf("9 的下标是 %d\\n", index);
    return 0;
}`, out: '9 的下标是 3' },
        { t: 'tip', x: '冒泡排序两层循环的边界 `n-1`、`n-1-i` 要记清：外层控制轮数，内层控制每轮比较次数。' }
      ],
      examples: [
        { title: '求数组的最大值', code: `#include <stdio.h>
int main() {
    int a[] = {3, 7, 2, 9, 5};
    int max = a[0];
    for (int i = 1; i < 5; i++) {
        if (a[i] > max) max = a[i];
    }
    printf("最大值是 %d\\n", max);
    return 0;
}`, note: '先假设第一个是最大，再逐个比较更新。' }
      ],
      exercises: [
        {
          id: 'ex-4-5-1', title: '线性查找', level: 'easy',
          prompt: '数组 `int a[] = {3, 7, 2, 9, 5};`，用线性查找找到数字 `9` 的下标并输出。',
          starter: `#include <stdio.h>
int main() {
    int a[] = {3, 7, 2, 9, 5};
    // 找到 9 的下标并输出
    return 0;
}`,
          hint: '遍历数组，`if (a[i] == 9)` 就打印 `i` 并 `break;`，结果是 3。',
          tests: [{ stdin: '', expected: '3' }]
        },
        {
          id: 'ex-4-5-2', title: '找最大值', level: 'mid',
          prompt: '读入 `n`（1 ≤ n ≤ 100），再读入 n 个整数存入数组，输出其中的最大值。',
          starter: `#include <stdio.h>
int main() {
    int n, a[100];
    // 读入 n 和数组，找最大值输出
    return 0;
}`,
          hint: '先读入 `n` 和数组，假设 `a[0]` 最大，再逐个比较更新。',
          tests: [{ stdin: '5\n3 9 2 7 5', expected: '9' }, { stdin: '3\n-1 -5 -3', expected: '-1' }]
        },
        {
          id: 'ex-4-5-3', title: '冒泡排序', level: 'hard',
          prompt: '读入 `n`（1 ≤ n ≤ 100）和 n 个整数，用**冒泡排序**把它们从小到大排好，再输出（每个后面一个空格）。',
          starter: `#include <stdio.h>
int main() {
    int n, a[100];
    // 读入 n 和数组，冒泡排序后输出
    return 0;
}`,
          hint: '两层循环：外层 `i` 控制轮数，内层 `j` 比较相邻元素，若 `a[j] > a[j+1]` 则交换。',
          tests: [{ stdin: '5\n5 2 8 1 9', expected: '1 2 5 8 9' }, { stdin: '4\n3 1 4 2', expected: '1 2 3 4' }]
        }
      ]
    }
  ],
  quiz: {
    title: '第四章 · 训练题',
    choice: [
      { q: '声明 `int a[5];` 后，合法的下标是？', options: ['`a[5]`', '`a[0]` 到 `a[4]`', '`a[1]` 到 `a[5]`', '任意整数'], answer: 1, explain: '下标从 0 开始，`a[5]` 的合法下标是 0~4。' },
      { q: 'C 语言中，字符串（字符数组）的结尾标志是？', options: ['`\\n`', '空格', '`\\0`', '`\\t`'], answer: 2, explain: '字符串以空字符 `\\0` 结尾。' },
      { q: '函数 `strlen("hello")` 的返回值是？', options: ['4', '5', '6', '1'], answer: 1, explain: '"hello" 有 5 个字符，strlen 不含结尾的 `\\0`，返回 5。' },
      { q: '`strcmp(a, b)` 返回 0 表示？', options: ['a 大于 b', 'a 小于 b', 'a 和 b 相等', '出错'], answer: 2, explain: 'strcmp 相等返回 0。' },
      { q: '打印字符串用的占位符是？', options: ['`%d`', '`%c`', '`%s`', '`%f`'], answer: 2, explain: '`%s` 对应字符串。' },
      { q: '下列哪个操作最容易导致数组越界？', options: ['`a[0]`', '`a[4]`（数组长度 5）', '`a[5]`（数组长度 5）', '`a[2]`'], answer: 2, explain: '长度 5 的数组合法下标是 0~4，`a[5]` 越界。' }
    ],
    fill: [
      { q: '一维数组 `int a[10];` 的最后一个元素的写法是 `a[____]`。', answer: '9', explain: '下标从 0 开始，长度 10 的数组最后一个下标是 9。' },
      { q: '求字符串长度的函数是 `____`。', answer: 'strlen', explain: '`strlen` 定义在 string.h 中，返回字符串长度。' },
      { q: '声明一个能存 3 行 4 列整数的二维数组，写法是 `int a[____];`。', answer: '3][4', accept: ['3][4];', '3][4）；'], explain: '二维数组 `int a[行数][列数]`，即 `int a[3][4]`。' }
    ],
    code: [
      {
        title: '数组元素求和', level: 'easy',
        prompt: '读入 5 个整数存入数组，输出它们的和（末尾换行）。',
        starter: `#include <stdio.h>
int main() {
    int a[5];
    // 读入 5 个数并求和输出
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int a[5], sum = 0;
    for (int i = 0; i < 5; i++) {
        scanf("%d", &a[i]);
        sum += a[i];
    }
    printf("%d\\n", sum);
    return 0;
}`,
        explain: '边读入边累加，或先读入数组再循环累加。',
        tests: [{ stdin: '1 2 3 4 5', expected: '15' }, { stdin: '10 20 30 40 50', expected: '150' }]
      },
      {
        title: '求数组最大值', level: 'mid',
        prompt: '读入 `n`（1 ≤ n ≤ 100），再读入 n 个整数，输出其中的最大值。',
        starter: `#include <stdio.h>
int main() {
    int n, a[100];
    // 读入 n 和数组，找最大值输出
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    int max = a[0];
    for (int i = 1; i < n; i++)
        if (a[i] > max) max = a[i];
    printf("%d\\n", max);
    return 0;
}`,
        explain: '先读入 n 和数组，假设 a[0] 最大，再逐个比较。',
        tests: [{ stdin: '5\n3 9 2 7 5', expected: '9' }, { stdin: '3\n-1 -5 -3', expected: '-1' }]
      },
      {
        title: '字符串反转', level: 'hard',
        prompt: '读入一个不含空格的字符串（长度不超过 100），将它反转后输出。例如输入 `hello`，输出 `olleh`。',
        starter: `#include <stdio.h>
#include <string.h>
int main() {
    char s[101];
    // 读入 s，反转并输出
    return 0;
}`,
        answer: `#include <stdio.h>
#include <string.h>
int main() {
    char s[101];
    scanf("%s", s);
    int n = strlen(s);
    for (int i = n - 1; i >= 0; i--) {
        printf("%c", s[i]);
    }
    printf("\\n");
    return 0;
}`,
        explain: '从最后一个字符往前逐个打印即可。',
        tests: [{ stdin: 'hello', expected: 'olleh' }, { stdin: 'abc', expected: 'cba' }]
      }
    ]
  }
});
