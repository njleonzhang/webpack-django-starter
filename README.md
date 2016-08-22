# 前端工程化的探索
不通过node层实现非SPA网页开发的前后端分离。
技术栈：webpack + jade + es6 + scss + swig等
项目git: [webpack-django-starter](https://github.com/njleonzhang/webpack-django-starter)

## 需求
* 项目需求公司官网。
* SEO很重要
* 页面简单，基本是几台页面，个别页面有动态内容
* 后台是Django

成品beta版（虽然有广告之嫌）：
* http://www.bsy365.com/


## 我们从前怎么做？
之前开发过的一些多页面网站都是在Django template目录下直接写Django模板（类似于写PHP和JSP），js和css又要写在Django项目的static目录下。前端没有工程化，前端代码被肢解分离在后端项目的目录里。做过这样项目的各位攻城狮应该都知道有多痛苦吧。
<center>
<img src="/assets/django_code_strcuture.png" width="300px">
</center>

缺点：
* 想测试？你需要一套后台环境
* 想livereload？要单独起个livereload进程监控前端代码的目录，还要在页面里特别的嵌入一段代码。[livereload](https://www.npmjs.com/package/livereload)
* 想压缩js和css？用[django compressor](https://django-compressor.readthedocs.io/en/latest/)吧。
* 想用jade？想用ES6？想用scss？想用npm管理依赖？应该都能做到，但是貌似都不太方便。

优点：
* 无脑，简单，人人都好上手

## 别人怎么做？

* SPA
Angular、Vue、React，用这些框架做个SPA，页面不需要后台渲染了，这样前端可以完全从后端脱离出来，前后端的交互只通过ajax来拿数据。这几个框架相比大家都很熟悉，优点我就不用我说了，stater的项目在git上也到处都是。其中我个人最喜欢Vue，但是搜索引擎，尤其是我们大天朝的baidu爸爸对js支持的并不好，所以单纯的SPA方式就不太适合我们的需求了。

* 后端渲染的SPA和带node层的大前端
react和vue2.0的后台渲染，淘宝的[中途岛](https://www.zhihu.com/question/23512853) 这些解决方案都是很精妙的，不得不佩服相处这些方案的人的睿智。然而我们的项目其实是比较简单的，同事们都觉得没有必要加个node层搞那么复杂。（也许并不复杂，只是我们没有实践过）

好吧！别人的做法不合适，只能自己想办法了。

## 我们到底面临的是什么问题？
正如我已经提到的：

```
之前开发过的一些多页面网站都是在Django template目录下直接写Django模板（类似于写PHP和JSP），js和css又要写在Django项目的static目录下。
```
仔细想来，其实Django只是想要模板和静态资源，我们可以直接在Django目录下写，当然也可以开一个前端工程来写，最后把模板和静态资源copy到Django工程的相应目录下。如下图：
<center>
![architecture1](/assets/architecture1.png)
图1
</center>

所以问题就是如何配置一个多页面的前端项目，这个项目
* release的时候：
能够输出Django模板的html文件、纯静态页面的html文件、css文件、js文件以及图片文件。2种html文件inject了所有其所依赖的静态文件，避免每次手动配置。

* dev的时候：
js、css和html都可以使用预编译器
能够支持livereload，实时看到代码的结果

## solution
看着这些需求，熟悉wepack的各位大神可以已经微微一笑了。大部分的功能用webpack都可以轻松实现，不过是一个基于webpack的多页面工程嘛。确实如此，把Django模板当做一种特别的html来看的话，其实就是如此。

**唯一的不同点是开发时如何能让node server渲染Django模板？**
我想的办法是在开发时用[swig.js](https://www.npmjs.com/package/swig)来代替Django渲染Django模板。（swig模板的语法和Django模板语法相似，加之它支持自定义tag和filter）

所以，最终的结构就是这样：
<center>
![architecture2](/assets/architecture2.png)
图2
</center>


项目的代码结构：
<center>
<img src="/assets/project1.png" width="200px">
图3
</center>

* build目录下是webpack、express以及swig的配置文件。
* config目录下是项目的一些可变配置，比如release的路径、是否生成sourcemap
* assets是一些全局资源，比如favicon
* common-style里是一些全局的css文件
* components里是页面的公用组件
  组件的jade文件、scss文件和js文件是组织在一个目录下的
* pages里是页面的实现，jade文件、scss文件和js文件是同样是组织在一个目录下的
* mock.js 是开发时express、swig用于渲染页面的假数据。

<center>
<img src="/assets/project2.png" width="200px">
图3
</center>

<center>
<img src="/assets/project3.png" width="200px">
图4
</center>

page目录下的jade文件分为两种：一种是dj.jade文件，一种是.jade文件。前者会被认为是Django模板，开发时会被swig渲染，发布时会被发布到template目录下。后者被认为是纯页面，开发时不会被swig渲染，release时会被放到static的html目录下。

另外，有时候一些页面是一组页面，他们很大一部分是一样的，比如图4中的about-us下面有2个页面author和company。此时，可以在about-us下面写一个base，把公共的内容写在base里。而base会被识别，在dev和release时都不会被当做页面处理。（不会生成一个base的页面）

## 结束语
东西比较多，写的也很乱，感觉很难让大家看明白。。。哈哈。看code吧。本项目是我们team的一次尝试，我们用这个架构写了2个项目，感觉还不错，不需要引入node层，前后端彻底分离了，在我们这样的特定项目背景下，比较适用，和大家分享下，希望有用。
