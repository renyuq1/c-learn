/* 第一章 · 程序设计基础 */
window.COURSE.push({
  id: 'ch1',
  title: '程序设计基础',
  icon: '🚀',
  intro: '认识程序、算法与开发环境，写出并运行你的第一个 C 程序。',
  chapters: [
    {
      id: '1-1',
      title: '程序与程序设计',
      lesson: [
        { t: 'p', x: '先搞清楚一个最基本的问题：**程序是什么？**' },
        { t: 'p', x: '简单说，程序就是**给计算机的一串指令**。计算机本身什么都不会「思考」，它只会忠实地、一步步地执行你写下的命令。你写下的这串命令，就是**程序**；写命令的过程，就是**程序设计**。' },
        { t: 'p', x: '那 `C 语言` 又是什么？它是一门**编程语言**——就像我们和计算机沟通用的「外语」。你用人能看懂的 C 语法写程序，计算机会把它翻译成自己能执行的机器指令。' },
        { t: 'h', x: '为什么学 C 语言？' },
        { t: 'list', x: [
          '**是根基**：C 是几乎所有操作系统、编程语言、底层软件的「祖爷爷」，学了它，别的语言理解起来更快。',
          '**贴近硬件**：C 能直接操作内存、指针，让你真正搞懂计算机是怎么工作的。',
          '**应用广**：操作系统、嵌入式、单片机、高性能计算，处处都有 C 的身影。'
        ] },
        { t: 'note', x: '学习编程的正确心态：**先会用，再慢慢懂原理**。就像学开车，先会上路，再研究发动机。很多概念你现在不用深究，用到自然就懂了。' }
      ],
      examples: [
        { title: '看看一个 C 程序长什么样', code: `#include <stdio.h>
int main() {
    printf("这是一个 C 程序");
    return 0;
}`, note: '点击「运行」，看看会发生什么。现在不用理解每一行，先有个印象。' }
      ],
      exercises: [
        {
          id: 'ex-1-1-1', title: '打印一句话', level: 'easy',
          prompt: '写一个完整的 C 程序，打印出 `这是用 C 语言写的程序`（末尾换行）。',
          starter: `#include <stdio.h>
int main() {
    // 在这里写你的代码
    return 0;
}`,
          hint: '用 `printf("这是用 C 语言写的程序\\n");` 打印。',
          tests: [{ stdin: '', expected: '这是用 C 语言写的程序' }]
        },
        {
          id: 'ex-1-1-2', title: '打印两行', level: 'easy',
          prompt: '写一个程序，用两个 `printf` 依次打印两行：第一行 `第一行`，第二行 `第二行`。',
          starter: `#include <stdio.h>
int main() {
    // 打印两行
    return 0;
}`,
          hint: '两行分别写成两个 `printf(...)`，每个末尾都加 `\\n`。',
          tests: [{ stdin: '', expected: '第一行\n第二行' }]
        }
      ]
    },
    {
      id: '1-2',
      title: '算法与流程图',
      lesson: [
        { t: 'p', x: '解决任何问题，都要先想清楚**步骤**，再动手。这个「解题步骤」就叫**算法**。' },
        { t: 'p', x: '比如「煮泡面」的算法就是：烧水 → 拆开面饼放碗里 → 倒开水 → 盖盖子等 3 分钟 → 加调料 → 吃。步骤明确、顺序正确，事情才能做成。' },
        { t: 'p', x: '计算机也一样：你要把解决问题的步骤，一步步用它能懂的方式写出来。写代码之前先想清楚步骤，是程序员最重要的习惯。' },
        { t: 'h', x: '算法的三大结构' },
        { t: 'p', x: '几乎所有的程序，都是由下面三种结构组合出来的：' },
        { t: 'list', x: [
          '**顺序结构**：按顺序一步步往下执行（最基础）。',
          '**选择结构**：根据条件决定走哪条路（`if` / `switch`）。',
          '**循环结构**：重复做某件事（`for` / `while`）。'
        ] },
        { t: 'h', x: '流程图' },
        { t: 'p', x: '流程图是用图形把算法画出来：圆角矩形表示「开始/结束」，矩形表示「处理步骤」，菱形表示「判断条件」，箭头表示走向。画图能帮你理清思路，尤其是复杂逻辑。' },
        { t: 'tip', x: '以后写每个小程序前，先在心里（或纸上）把步骤过一遍，比直接埋头写代码快得多，也少很多 bug。' }
      ],
      examples: [
        { title: '一个「判断成绩是否及格」的步骤', code: `#include <stdio.h>
int main() {
    int score = 75;
    if (score >= 60) {
        printf("及格了\\n");
    } else {
        printf("不及格\\n");
    }
    return 0;
}`, note: '这就是「选择结构」：条件 `score >= 60` 成立就打印「及格了」。' }
      ],
      exercises: [
        {
          id: 'ex-1-2-1', title: '顺序结构打印三行', level: 'easy',
          prompt: '程序按顺序一步步执行。请写一个程序，用三次 `printf` 依次打印三行：`开始`、`执行`、`结束`。',
          starter: `#include <stdio.h>
int main() {
    // 依次打印三行
    return 0;
}`,
          hint: '三次 `printf` 分别打印三行，每个末尾都加 `\\n`。',
          tests: [{ stdin: '', expected: '开始\n执行\n结束' }]
        },
        {
          id: 'ex-1-2-2', title: '打印一条分隔线', level: 'easy',
          prompt: '写一个程序，打印一行由 10 个短横线 `-` 组成的分隔线。',
          starter: `#include <stdio.h>
int main() {
    // 打印分隔线
    return 0;
}`,
          hint: '直接 `printf("----------\\n");`。',
          tests: [{ stdin: '', expected: '----------' }]
        }
      ]
    },
    {
      id: '1-3',
      title: '开发环境与工具',
      lesson: [
        { t: 'p', x: '要写 C 程序，你需要一个**编辑器**（写代码）+ 一个**编译器**（把代码翻译成可执行文件）。' },
        { t: 'p', x: '对于刚入门，本网站已经帮你准备好了在线编辑器 + 在线编译器，你**不需要安装任何软件**，直接在网页里写、点「运行」就能看到结果。' },
        { t: 'h', x: '以后想在本地写 C 程序，推荐这些工具' },
        { t: 'list', x: [
          '**Windows**：Dev-C++、Code::Blocks、或者 VS Code + MinGW（gcc）。',
          '**macOS**：Xcode 命令行工具（自带 gcc），或 VS Code。',
          '**Linux**：几乎都自带 gcc，编辑器用 VS Code / Vim。'
        ] },
        { t: 'p', x: '其中 `gcc` 是最常用的 C 编译器，本网站在线编译用的就是它。你现在只要记住：**写代码 → 编译 → 运行** 这三步即可。' },
        { t: 'note', x: '本网站用免费在线编译器（Wandbox）运行 C 代码，需要联网。如果断网，「运行」会提示失败，但你依然可以查看讲解和参考答案。' }
      ],
      examples: [],
      exercises: [
        {
          id: 'ex-1-3-1', title: '打印一条消息', level: 'easy',
          prompt: '写一个程序，打印出 `开发环境已就绪`（末尾换行）。',
          starter: `#include <stdio.h>
int main() {
    // 在这里写你的代码
    return 0;
}`,
          hint: '用 `printf("开发环境已就绪\\n");`。',
          tests: [{ stdin: '', expected: '开发环境已就绪' }]
        },
        {
          id: 'ex-1-3-2', title: '打印三行', level: 'easy',
          prompt: '写一个程序，依次打印三行：`写代码`、`编译`、`运行`。',
          starter: `#include <stdio.h>
int main() {
    // 依次打印三行
    return 0;
}`,
          hint: '三个 `printf`，每个末尾都带 `\\n`。',
          tests: [{ stdin: '', expected: '写代码\n编译\n运行' }]
        }
      ]
    },
    {
      id: '1-4',
      title: '第一个 C 程序：Hello, World!',
      lesson: [
        { t: 'p', x: '编程界有个传统：学任何语言，第一件事都是让屏幕打印出 `Hello, World!`。我们看看它在 C 里怎么写：' },
        { t: 'code', x: `#include <stdio.h>
int main() {
    printf("Hello, World!\\n");
    return 0;
}`, out: 'Hello, World!' },
        { t: 'h', x: '逐行解释' },
        { t: 'list', x: [
          '`#include <stdio.h>`：告诉编译器「我要用到标准输入输出库」，这样 `printf` 才能用。',
          '`int main()`：程序从这里开始执行，`main` 是主函数，每个 C 程序都必须有它。',
          '`{` 和 `}`：一对花括号，把要执行的语句包起来。',
          '`printf("...")`：打印括号里的文字到屏幕。',
          '`return 0;`：告诉系统「程序正常结束」。'
        ] },
        { t: 'h', x: '注意这两点' },
        { t: 'warn', x: '`\\n` 是「换行符」，让光标换到下一行。如果不写它，输出不会换行。' },
        { t: 'warn', x: 'C 语言**区分大小写**，并且每条语句结尾都要有分号 `;`。少了分号会报错。' },
        { t: 'tip', x: '先别管每行的细节，把它当成一个「模板」记下来：以后每次写 C 程序，都先搭好这个框架，再往里面填内容。' }
      ],
      examples: [
        { title: '打印自己的名字', code: `#include <stdio.h>
int main() {
    printf("我叫小明\\n");
    printf("正在学 C 语言\\n");
    return 0;
}`, note: '把名字换成你自己的，再运行一次。每个 `printf` 打印一行。' }
      ],
      exercises: [
        {
          id: 'ex-1-4-1', title: '打印 Hello, World!', level: 'easy',
          prompt: '写一个程序打印出 `Hello, World!`（注意大小写、逗号和空格，末尾换行）。',
          starter: `#include <stdio.h>
int main() {
    // 在这里写你的代码
    return 0;
}`,
          hint: '`printf("Hello, World!\\n");`。',
          tests: [{ stdin: '', expected: 'Hello, World!' }]
        },
        {
          id: 'ex-1-4-2', title: '打印自己的名字', level: 'easy',
          prompt: '写一个程序打印出 `我叫小明`（可以把「小明」换成你自己的名字）。',
          starter: `#include <stdio.h>
int main() {
    // 打印你的名字
    return 0;
}`,
          hint: '`printf("我叫小明\\n");`。',
          tests: [{ stdin: '', expected: '我叫小明' }]
        },
        {
          id: 'ex-1-4-3', title: '用换行符打印两行', level: 'easy',
          prompt: '写一个程序，用 `\\n` 让输出换行，先打印 `Hello` 再打印 `World`（两行）。',
          starter: `#include <stdio.h>
int main() {
    // 打印两行
    return 0;
}`,
          hint: '在一个 `printf` 里写 `printf("Hello\\nWorld\\n");` 也可以。',
          tests: [{ stdin: '', expected: 'Hello\nWorld' }]
        }
      ]
    },
    {
      id: '1-5',
      title: '程序编译与运行的过程',
      lesson: [
        { t: 'p', x: '你写下的 C 代码（叫**源代码**）计算机看不懂，需要经过**编译**，翻译成机器能直接执行的**可执行文件**，然后才能**运行**。' },
        { t: 'h', x: '整个过程分四步' },
        { t: 'ol', x: [
          '**编写**：用编辑器写出源代码（`.c` 文件）。',
          '**预处理**：处理 `#include` 等以 `#` 开头的指令。',
          '**编译**：把源代码翻译成机器指令，生成目标文件（`.o`）。',
          '**链接**：把目标文件和用到的库合并，生成可执行文件（`.exe` / 无后缀）。'
        ] },
        { t: 'p', x: '在命令行里，用 gcc 编译一个 `hello.c` 的命令是：`gcc hello.c -o hello`，然后运行 `./hello`（Windows 下是 `hello.exe`）。' },
        { t: 'p', x: '在本网站，你只需要点「运行」，这四步会**自动在云端完成**，然后直接把结果打印给你。你不需要关心背后的细节，专心学语法即可。' },
        { t: 'h', x: '如果编译出错' },
        { t: 'p', x: '语法写错时，编译器会报**编译错误**（比如少了分号、拼错了函数名），并告诉你大概在哪一行。会读报错信息，是每个程序员的基本功。' },
        { t: 'tip', x: '读报错就抓住两件事：**在哪一行**、**什么问题**。先看第一个错误，往往修好它后面就顺了。' }
      ],
      examples: [
        { title: '故意制造一个编译错误', code: `#include <stdio.h>
int main() {
    printf("这行是对的\\n")
    return 0;
}`, note: '运行看看报错信息长什么样（少了分号）。然后试着把错误改对。' }
      ],
      exercises: [
        {
          id: 'ex-1-5-1', title: '补上缺失的分号', level: 'easy',
          prompt: '下面的程序少了一个分号，导致编译报错。请补上分号，让它正常打印出 `你好`。',
          starter: `#include <stdio.h>
int main() {
    printf("你好\\n")
    return 0;
}`,
          hint: 'C 语言每条语句结尾都要有分号 `;`。在 `printf(...)` 那一行末尾加上。',
          tests: [{ stdin: '', expected: '你好' }]
        },
        {
          id: 'ex-1-5-2', title: '打印一条问候语', level: 'easy',
          prompt: '写一个程序，打印出 `开始学 C 语言`（末尾换行）。',
          starter: `#include <stdio.h>
int main() {
    // 在这里写你的代码
    return 0;
}`,
          hint: '`printf("开始学 C 语言\\n");`。',
          tests: [{ stdin: '', expected: '开始学 C 语言' }]
        }
      ]
    }
  ],
  quiz: {
    title: '第一章 · 训练题',
    choice: [
      { q: '一个 C 程序从哪里开始执行？', options: ['从第一行开始', '从 `main` 函数开始', '从最后一行开始', '从 `printf` 开始'], answer: 1, explain: '`main` 是程序的主函数，程序总是从 `main` 函数开始执行。' },
      { q: '下列哪个函数用来在屏幕上打印输出？', options: ['`print`', '`output`', '`printf`', '`echo`'], answer: 2, explain: 'C 语言中用 `printf` 打印输出，它定义在 `stdio.h` 中。' },
      { q: '`#include <stdio.h>` 的作用是？', options: ['定义一个函数', '引入标准输入输出库，使 `printf` 等函数可用', '打印一行文字', '结束程序'], answer: 1, explain: '`#include <stdio.h>` 引入标准输入输出库，提供 `printf`、`scanf` 等函数。' },
      { q: 'C 语言中每条语句的结尾通常要写什么？', options: ['逗号 `,`', '句号 `.`', '分号 `;`', '冒号 `:`'], answer: 2, explain: 'C 语言以分号 `;` 表示一条语句结束，缺少会报错。' },
      { q: '「算法」指的是什么？', options: ['一种编程语言', '解决某个问题的步骤', '编译器的名称', '一段固定代码'], answer: 1, explain: '算法就是解决问题的明确步骤，写代码前先想清楚算法是好习惯。' }
    ],
    fill: [
      { q: '每个 C 程序都必须有、程序从这里开始执行的函数叫 `____`。', answer: 'main', accept: ['main函数'], explain: '`main` 是主函数，是程序的入口。' },
      { q: '在 `printf` 里，表示「换行」的转义字符写作 `____`。', answer: '\\n', explain: '`\\n` 是换行符，让光标移到下一行。' },
      { q: 'C 语言中，用 `____` 语句表示程序正常结束并返回 0。', answer: 'return 0', accept: ['return 0;'], explain: '`return 0;` 告诉系统程序正常结束。' }
    ],
    code: [
      {
        title: '打印一句话', level: 'easy',
        prompt: '写一个完整的 C 程序，打印出 `你好，C 语言`（末尾换行）。',
        starter: `#include <stdio.h>
int main() {
    // 在这里写你的打印语句
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    printf("你好，C 语言\\n");
    return 0;
}`,
        explain: '在 `main` 函数里用 `printf` 打印，字符串要用英文双引号包起来。',
        tests: [{ stdin: '', expected: '你好，C 语言' }]
      },
      {
        title: '打印 Hello, World!', level: 'easy',
        prompt: '写一个程序打印出 `Hello, World!`（注意大小写、逗号和空格，末尾换行）。',
        starter: `#include <stdio.h>
int main() {
    // 你的代码
    return 0;
}`,
        answer: `#include <stdio.h>
int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
        explain: '这是每个程序员的第一行程序，注意大小写要和题目完全一致。',
        tests: [{ stdin: '', expected: 'Hello, World!' }]
      }
    ]
  }
});
