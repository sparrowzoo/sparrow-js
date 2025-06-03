build distribution
---

```
git remote add alibaba git@github.com:alibaba/nacos.git
mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U
cd distribution/target/nacos-server-2.1.1/nacos/bin
sh startup.sh -m standalone
```
