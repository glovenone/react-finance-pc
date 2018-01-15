## 嘟嘟金融PC端项目
#### 本架构使用 react16, next.js4, antd3, redux
## 注意事项
- 本架构在每次提交时，都会对js文件进行 eslint 检测，如果检测通不过，则无法提交，所以请严格执行，本架构的语法规则。

#### 分支权限
```
master 分支做了保护，你不能强制推送到这个分支，也不能删除它。  
在合并之前需要提交请求评论  
所有提交必须提交给一个不受保护的分支，并通过一个拉取请求提交，至少有一个批准的审查，并且在它被合并到 master 之前不需要更改。  
当新的提交被推时，解除陈旧的请求批准  
推荐给分支的新的可审查的提交将取消提交请求审核批准。  
需要代码所有者进行审查  
需要在包括具有指定代码所有者的文件的拉取请求中进行批准的审查  
```
#### 本项目分支管理策略
1. master主分支只能拉取，不能推送
2. 你们需要在本地单独开一个分支进行开发，完毕之后，推送你的分支到远程。如果没有冲突，我将其合并到到主分支，否则，你需要重新提交。
3. 在你每次新的开发任务前，你有必要切到主分支，拉取最新版本，然后切到开发分支，将主分支合并过来，保证自己的开发分支处于最新版本状态。
4. 原则上，如果没有紧急bug修复，每天早上一次拉取，下班前一次提交即可。


