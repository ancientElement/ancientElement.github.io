git add .
git commit -m "Auto commit at %date:~0,10%,%time:~0,8%"
git push

hexo g && cd public && git add . && git commit -m "Auto commit at %date:~0,10%,%time:~0,8%" && git push origin@REM&& git push github