/* 第八章 · 文件操作 */
window.COURSE.push({
  id: 'ch8',
  title: '文件操作',
  icon: '📄',
  intro: '让程序读写磁盘上的文件，持久化保存数据。',
  chapters: [
    {
      id: '8-1',
      title: '文件的概念与 fopen / fclose',
      lesson: [
        { t: 'p', x: '到目前为止，程序的数据一关就没了。要让数据**持久保存**（比如存成绩、存配置），就要把它写到磁盘的**文件**里。' },
        { t: 'p', x: 'C 语言里操作文件，核心是一个指针类型：`FILE *`（文件指针）。所有文件操作都通过它完成。' },
        { t: 'h', x: '打开文件：fopen' },
        { t: 'p', x: '`fopen("文件名", "模式")` 打开一个文件，返回 `FILE*`。模式决定了「读」还是「写」：' },
        { t: 'table', head: ['模式', '含义'], rows: [
          ['`"r"`', '只读，文件必须存在'],
          ['`"w"`', '只写，不存在则创建，**存在则清空**'],
          ['`"a"`', '追加，在末尾接着写'],
          ['`"r+"`', '读写（文件必须存在）'],
          ['`"wb"` / `"rb"`', '二进制方式写 / 读']
        ] },
        { t: 'code', x: `#include <stdio.h>

int main() {
    FILE *fp = fopen("note.txt", "w");   // 以只写方式打开
    if (fp == NULL) {
        printf("打开文件失败\\n");
        return 1;
    }
    fprintf(fp, "这是第一行\\n");         // 写入
    fclose(fp);                            // 关闭文件
    printf("写入完成\\n");
    return 0;
}`, out: '写入完成' },
        { t: 'h', x: '关闭文件：fclose' },
        { t: 'p', x: '用完文件一定要 `fclose(fp)` 关闭，它会把缓冲区里的数据真正写进磁盘并释放资源。' },
        { t: 'warn', x: '`fopen` 可能失败（比如文件不存在、没权限），返回 `NULL`。所以打开后要**先判断是不是 NULL**，养成习惯。' },
        { t: 'tip', x: '记住口诀：**打开要判断，用完要关闭**。' }
      ],
      examples: [
        { title: '用追加模式写文件', code: `#include <stdio.h>

int main() {
    FILE *fp = fopen("log.txt", "a");   // 追加模式
    if (fp == NULL) return 1;
    fprintf(fp, "新的一行\\n");
    fclose(fp);
    printf("已追加\\n");
    return 0;
}`, note: '追加模式不会清空原内容，只在末尾加。' }
      ],
      exercises: [
        {
          id: 'ex-8-1-1', title: '写文件', level: 'easy',
          prompt: '用 `fopen` 以写模式打开 `t.txt`，写入一行文字，`fclose` 关闭后打印 `写入完成`。',
          starter: `#include <stdio.h>
int main() {
    // 打开 t.txt（写模式），写入，关闭，打印"写入完成"
    return 0;
}`,
          hint: '`FILE *fp = fopen("t.txt", "w"); fprintf(fp, "你好\\n"); fclose(fp); printf("写入完成\\n");`。',
          tests: [{ stdin: '', expected: '写入完成' }]
        },
        {
          id: 'ex-8-1-2', title: '写文件再读回', level: 'mid',
          prompt: '把 `Hello C` 写入 `out.txt` 并关闭，再以读方式打开，把内容读出来并打印（末尾换行）。',
          starter: `#include <stdio.h>
int main() {
    // 写 "Hello C" 到 out.txt，再读出来打印
    return 0;
}`,
          hint: '先 `fopen("out.txt","w")` 写入并 `fclose`；再 `fopen("out.txt","r")` 用 `fgets` 读，`printf` 出来。',
          tests: [{ stdin: '', expected: 'Hello C' }]
        }
      ]
    },
    {
      id: '8-2',
      title: '文件的顺序读写（字符与字符串）',
      lesson: [
        { t: 'p', x: '按「从头到尾」的顺序读写文件，最常用的有四个函数。' },
        { t: 'h', x: '字符读写：fgetc / fputc' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    FILE *fp = fopen("t.txt", "w");
    fputc('A', fp);   // 写入一个字符
    fputc('B', fp);
    fclose(fp);

    fp = fopen("t.txt", "r");
    int c;
    while ((c = fgetc(fp)) != EOF) {   // 一个个读，直到文件尾
        printf("%c", c);
    }
    printf("\\n");
    fclose(fp);
    return 0;
}`, out: 'AB' },
        { t: 'h', x: '字符串读写：fgets / fputs' },
        { t: 'p', x: '`fputs` 写一个字符串，`fgets` 读一行字符串（会保留换行，并在末尾加 `\\0`）。' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    FILE *fp = fopen("t.txt", "w");
    fputs("第一行\\n", fp);
    fputs("第二行\\n", fp);
    fclose(fp);

    char line[100];
    fp = fopen("t.txt", "r");
    while (fgets(line, 100, fp) != NULL) {   // 读一行，到文件尾返回 NULL
        printf("%s", line);
    }
    fclose(fp);
    return 0;
}`, out: '第一行\n第二行' },
        { t: 'warn', x: '`fgetc` 返回的是 `int`（不是 char），这样才能区分「读到字符 255」和「读到文件尾 EOF」。用 `int c` 接收。' },
        { t: 'tip', x: '判断文件读完：字符用 `!= EOF`，字符串用 `!= NULL`。' }
      ],
      examples: [
        { title: '复制文件内容', code: `#include <stdio.h>

int main() {
    FILE *src = fopen("a.txt", "w");
    fputs("hello world", src);
    fclose(src);

    src = fopen("a.txt", "r");
    FILE *dst = fopen("b.txt", "w");
    int c;
    while ((c = fgetc(src)) != EOF) {
        fputc(c, dst);
    }
    fclose(src);
    fclose(dst);
    printf("复制完成\\n");
    return 0;
}`, note: '从 a.txt 读，写到 b.txt，实现文件复制。' }
      ],
      exercises: [
        {
          id: 'ex-8-2-1', title: '用 fputs/fgets 读写字符串', level: 'mid',
          prompt: '用 `fputs` 把 `第一行`、`第二行` 两行写入文件，再重新打开用 `fgets` 逐行读出来打印。',
          starter: `#include <stdio.h>
int main() {
    // 用 fputs 写两行，再 fgets 读回来打印
    return 0;
}`,
          hint: '写 `fputs("第一行\\n", fp); fputs("第二行\\n", fp);`，读 `while (fgets(line, 100, fp)) printf("%s", line);`。',
          tests: [{ stdin: '', expected: '第一行\n第二行' }]
        },
        {
          id: 'ex-8-2-2', title: '用 fputc/fgetc 读写字符', level: 'mid',
          prompt: '用 `fputc` 依次写入字符 `A`、`B`、`C`，再重新打开用 `fgetc` 逐个读出来打印。',
          starter: `#include <stdio.h>
int main() {
    // 用 fputc 写 "ABC"，再 fgetc 读回来打印
    return 0;
}`,
          hint: '写 `fputc(\'A\', fp); fputc(\'B\', fp); fputc(\'C\', fp);`，读 `while ((c = fgetc(fp)) != EOF) printf("%c", c);`。',
          tests: [{ stdin: '', expected: 'ABC' }]
        }
      ]
    },
    {
      id: '8-3',
      title: '格式化读写与二进制读写',
      lesson: [
        { t: 'p', x: '除了按字符、字符串读，还能像 `printf`/`scanf` 一样按格式读写，或者用二进制方式存取数据。' },
        { t: 'h', x: '格式化读写：fprintf / fscanf' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    FILE *fp = fopen("data.txt", "w");
    fprintf(fp, "%d %.2f\\n", 100, 3.14);   // 像 printf 一样写
    fclose(fp);

    int n;
    double f;
    fp = fopen("data.txt", "r");
    fscanf(fp, "%d %lf", &n, &f);           // 像 scanf 一样读
    fclose(fp);
    printf("读到：%d %.2f\\n", n, f);
    return 0;
}`, out: '读到：100 3.14' },
        { t: 'h', x: '二进制读写：fwrite / fread' },
        { t: 'p', x: '二进制方式存取数据更快、更省空间，尤其适合存结构体。`fwrite`/`fread` 按「字节块」读写：' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    int a[5] = {1, 2, 3, 4, 5};
    FILE *fp = fopen("bin.dat", "wb");       // 二进制写
    fwrite(a, sizeof(int), 5, fp);           // 写 5 个 int
    fclose(fp);

    int b[5] = {0};
    fp = fopen("bin.dat", "rb");             // 二进制读
    fread(b, sizeof(int), 5, fp);
    fclose(fp);

    for (int i = 0; i < 5; i++) printf("%d ", b[i]);
    printf("\\n");
    return 0;
}`, out: '1 2 3 4 5' },
        { t: 'h', x: 'fwrite / fread 的参数' },
        { t: 'p', x: '`fwrite(数据地址, 每个元素大小, 元素个数, 文件指针)`。它返回实际写入/读到的元素个数。' },
        { t: 'warn', x: '二进制文件用 `"wb"`/`"rb"` 打开，**不能用文本编辑器正常查看**，要用对应的 `fread` 读回来。' },
        { t: 'tip', x: '存结构体数组用二进制方式特别方便：`fwrite(arr, sizeof(结构体), n, fp)` 一行搞定。' }
      ],
      examples: [
        { title: '用二进制方式保存结构体', code: `#include <stdio.h>

typedef struct { int id; double score; } Stu;

int main() {
    Stu s1 = {1, 92.5};
    FILE *fp = fopen("s.dat", "wb");
    fwrite(&s1, sizeof(Stu), 1, fp);
    fclose(fp);

    Stu s2;
    fp = fopen("s.dat", "rb");
    fread(&s2, sizeof(Stu), 1, fp);
    fclose(fp);
    printf("%d %.1f\\n", s2.id, s2.score);
    return 0;
}`, note: '结构体也能整体读写。' }
      ],
      exercises: [
        {
          id: 'ex-8-3-1', title: '用 fprintf/fscanf 格式化读写', level: 'mid',
          prompt: '用 `fprintf` 把整数 `100` 和小数 `3.14` 写入文件，再重新打开用 `fscanf` 读回并打印（`%d` 和 `%.2f`）。',
          starter: `#include <stdio.h>
int main() {
    // 用 fprintf 写 "100 3.14"，再用 fscanf 读回来打印
    return 0;
}`,
          hint: '写 `fprintf(fp, "%d %.2f\\n", 100, 3.14);`，读 `fscanf(fp, "%d %lf", &n, &f); printf("%d %.2f\\n", n, f);`。',
          tests: [{ stdin: '', expected: '100 3.14' }]
        },
        {
          id: 'ex-8-3-2', title: '用 fwrite/fread 读写数组', level: 'mid',
          prompt: '用 `fwrite` 把 `int a[5] = {1, 2, 3, 4, 5};` 以二进制写入文件，再重新打开用 `fread` 读回并打印。',
          starter: `#include <stdio.h>
int main() {
    int a[5] = {1, 2, 3, 4, 5};
    // 用 fwrite 二进制写入，再 fread 读回并打印
    return 0;
}`,
          hint: '写 `fwrite(a, sizeof(int), 5, fp);`（模式 "wb"），读 `fread(b, sizeof(int), 5, fp);`（模式 "rb"），再循环打印。',
          tests: [{ stdin: '', expected: '1 2 3 4 5' }]
        }
      ]
    },
    {
      id: '8-4',
      title: '文件的随机读写',
      lesson: [
        { t: 'p', x: '前面的读写都是「顺序」的——从头到尾。有时你想直接跳到文件某个位置，这就是**随机读写**。' },
        { t: 'h', x: '三个函数' },
        { t: 'table', head: ['函数', '作用'], rows: [
          ['`fseek(fp, 偏移量, 起点)`', '移动读写位置到指定处'],
          ['`ftell(fp)`', '返回当前位置（从文件开头算的字节数）'],
          ['`rewind(fp)`', '回到文件开头']
        ] },
        { t: 'p', x: '`fseek` 的「起点」有三种：`SEEK_SET`（文件开头）、`SEEK_CUR`（当前位置）、`SEEK_END`（文件末尾）。' },
        { t: 'code', x: `#include <stdio.h>

int main() {
    FILE *fp = fopen("t.txt", "w");
    fputs("abcdefghij", fp);
    fclose(fp);

    fp = fopen("t.txt", "r");
    fseek(fp, 5, SEEK_SET);   // 跳到第 5 个字节（即 'f'）
    int c = fgetc(fp);
    printf("第 5 个字符是 %c\\n", c);

    long pos = ftell(fp);
    printf("当前位置 %ld\\n", pos);

    rewind(fp);               // 回到开头
    printf("开头字符是 %c\\n", fgetc(fp));
    fclose(fp);
    return 0;
}`, out: '第 5 个字符是 f\n当前位置 6\n开头字符是 a' },
        { t: 'warn', x: '`fseek` 的偏移量是**字节数**，对于包含中文等多字节字符的文件要小心，可能定位到半个字符中间。' },
        { t: 'tip', x: '随机读写常用于「记录大小固定」的文件，比如二进制结构体数组：要读第 n 条，直接 `fseek(fp, n * sizeof(记录), SEEK_SET)`。' }
      ],
      examples: [
        { title: '读取文件大小', code: `#include <stdio.h>

int main() {
    FILE *fp = fopen("t.txt", "w");
    fputs("hello world", fp);
    fclose(fp);

    fp = fopen("t.txt", "r");
    fseek(fp, 0, SEEK_END);   // 移到末尾
    long size = ftell(fp);    // 当前位置就是文件大小
    fclose(fp);
    printf("文件大小：%ld 字节\\n", size);
    return 0;
}`, note: '移到末尾再用 ftell，就能得到文件大小。' }
      ],
      exercises: [
        {
          id: 'ex-8-4-1', title: '用 fseek 定位读字符', level: 'mid',
          prompt: '把字符串 `abcdefghij` 写入文件，再重新打开，用 `fseek` 跳到第 5 个字节，读取并打印那个字符。',
          starter: `#include <stdio.h>
int main() {
    // 写 "abcdefghij" 到 t.txt，再 fseek 到第 5 个字节读一个字符打印
    return 0;
}`,
          hint: '写好后 `fseek(fp, 5, SEEK_SET);` 再 `c = fgetc(fp); printf("%c\\n", c);`，第 5 个字符是 f。',
          tests: [{ stdin: '', expected: 'f' }]
        },
        {
          id: 'ex-8-4-2', title: '用 ftell 求文件大小', level: 'mid',
          prompt: '把 `hello world` 写入文件，用 `fseek` 移到末尾 + `ftell` 求出文件大小（字节数）并输出。',
          starter: `#include <stdio.h>
int main() {
    // 写 "hello world" 到 t.txt，用 fseek + ftell 求文件大小输出
    return 0;
}`,
          hint: '`fseek(fp, 0, SEEK_END);` 移到末尾，`long size = ftell(fp);` 就是大小（11），`printf("%ld\\n", size);`。',
          tests: [{ stdin: '', expected: '11' }]
        }
      ]
    }
  ],
  quiz: {
    title: '第八章 · 训练题',
    choice: [
      { q: '以「只写」方式打开文件，且会清空原内容，用哪个模式？', options: ['`"r"`', '`"w"`', '`"a"`', '`"x"`'], answer: 1, explain: '`"w"` 只写，存在则清空，不存在则创建。' },
      { q: '关闭文件用的函数是？', options: ['`fopen`', '`fclose`', '`close`', '`fread`'], answer: 1, explain: '`fclose(fp)` 关闭文件并释放资源。' },
      { q: '`fopen` 打开文件失败时返回什么？', options: ['`0`', '`NULL`', '`-1`', '空字符串'], answer: 1, explain: '失败返回 NULL，所以要判断。' },
      { q: '用 `fgetc` 读取，判断读到文件末尾的标准是？', options: ['返回值 == NULL', '返回值 == EOF', '返回值 == 0', '无法判断'], answer: 1, explain: 'fgetc 返回 int，读到文件尾返回 EOF。' },
      { q: '向文件写入格式化数据（像 printf 一样），用哪个函数？', options: ['`fprintf`', '`fputs`', '`fputc`', '`fwrite`'], answer: 0, explain: '`fprintf` 格式化写入文件。' },
      { q: '把文件读写位置移到开头，用哪个函数？', options: ['`fseek(fp, 0, SEEK_END)`', '`rewind(fp)`', '`ftell(fp)`', '`fread`'], answer: 1, explain: '`rewind(fp)` 回到文件开头。' }
    ],
    fill: [
      { q: '打开文件的函数是 `____`。', answer: 'fopen', explain: '`fopen("文件名", "模式")` 打开文件返回 FILE*。' },
      { q: '以「追加」方式打开文件的模式字符串是 `____`。', answer: '"a"', accept: ['a', '“a”'], explain: '`"a"` 表示追加，在文件末尾接着写。' },
      { q: '二进制方式写文件，打开时模式写成 `____`。', answer: '"wb"', accept: ['wb', '“wb”'], explain: '`"wb"` 以二进制只写方式打开。' }
    ],
    code: [
      {
        title: '写入并读回文件', level: 'mid',
        prompt: '写一个程序：以写方式打开 `out.txt`，写入 `Hello C`，关闭；再以读方式打开，把内容读出来并打印（末尾换行）。',
        starter: `#include <stdio.h>
int main() {
    // 写入 out.txt，再读出来打印
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    FILE *fp = fopen("out.txt", "w");
    fprintf(fp, "Hello C");
    fclose(fp);

    fp = fopen("out.txt", "r");
    char buf[100];
    fgets(buf, 100, fp);
    printf("%s\\n", buf);
    fclose(fp);
    return 0;
}`,
        explain: '先 fopen("w") 写入，fclose；再 fopen("r") 用 fgets 读出来打印。',
        tests: [{ stdin: '', expected: 'Hello C' }]
      },
      {
        title: '统计文件字符数', level: 'hard',
        prompt: '写一个程序：先向 `t.txt` 写入字符串 `hello world`，关闭；再重新打开，用 `fgetc` 逐个字符读取，统计字符个数并输出。',
        starter: `#include <stdio.h>
int main() {
    // 写入 t.txt，再逐个字符读取统计个数
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    FILE *fp = fopen("t.txt", "w");
    fputs("hello world", fp);
    fclose(fp);

    fp = fopen("t.txt", "r");
    int count = 0, c;
    while ((c = fgetc(fp)) != EOF) count++;
    fclose(fp);
    printf("%d\\n", count);
    return 0;
}`,
        explain: '写入 "hello world"（11 个字符），再用 fgetc 循环读取计数，直到 EOF。',
        tests: [{ stdin: '', expected: '11' }]
      }
    ]
  }
});
