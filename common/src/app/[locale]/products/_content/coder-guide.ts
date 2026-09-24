import {getTranslations} from "next-intl/server";

export type CoderGuide = {
    requirements: {name: string; version: string}[];
    repositories: {name: string; role: string; href: string}[];
    setup: {title: string; description: string; code?: string; language?: string; note?: string}[];
    workflow: {title: string; description: string}[];
    faq: {question: string; answer: string}[];
    modules: {name: string; description: string}[];
};

const requirements = [
    {name: "JDK", version: "17+"},
    {name: "Maven", version: "3.6+"},
    {name: "MySQL", version: "5.7 / 8.x"},
    {name: "Redis", version: "5+"},
    {name: "Node.js", version: "18+"},
];

const repositoryNames = [
    "sparrow-shell",
    "sparrow-starter",
    "sparrow-file",
    "sparrow-passport-ddd",
    "sparrow-example",
    "sparrow-js",
    "sparrow-coder",
];

const moduleNames = [
    "bom",
    "coder-protocol",
    "coder-po",
    "coder-dao-api",
    "coder-dao-sparrow",
    "coder-dao-mybatis",
    "coder-domain",
    "coder-infrastructure",
    "coder-adapter",
    "coder-spring-starter",
    "coder-main-spring-boot",
    "ddl",
];

const commands = [
    {
        language: "bash",
        code: `mkdir -p ~/workspace/sparrow
cd ~/workspace/sparrow
git clone https://github.com/sparrowzoo/sparrow-shell.git
git clone https://github.com/sparrowzoo/sparrow-starter.git
git clone https://github.com/sparrowzoo/sparrow-file.git
git clone https://github.com/sparrowzoo/sparrow-passport-ddd.git
git clone https://github.com/sparrowzoo/sparrow-js.git
git clone https://github.com/sparrowzoo/sparrow-coder.git

cd ~/workspace
git clone https://github.com/sparrowzoo/sparrow-example.git`,
    },
    {
        language: "bash",
        code: `cd ~/workspace/sparrow/sparrow-shell
mvn clean install -Dmaven.test.skip=true
cd ../sparrow-starter
mvn clean install -Dmaven.test.skip=true
cd ../sparrow-file
mvn clean install -Dmaven.test.skip=true
cd ../sparrow-passport-ddd
mvn clean install -Dmaven.test.skip=true
cd ../sparrow-coder
mvn clean install -Dmaven.test.skip=true`,
    },
    {
        language: "bash",
        code: `cd ~/workspace/sparrow/sparrow-coder
mysql -uroot -p -e "CREATE DATABASE IF NOT EXISTS sparrow;"
mysql -uroot -p sparrow < ddl/t_project_config.sql
mysql -uroot -p sparrow < ddl/t_table_config.sql
mysql -uroot -p sparrow < ddl/t_user_example.sql`,
    },
    {
        language: "properties",
        code: `workspace=/Users/<your-name>/workspace
project_root=sparrow
frontend_project_root=sparrow/sparrow-js

spring.datasource.druid.url=jdbc:mysql://127.0.0.1/sparrow?useSSL=false&useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
spring.datasource.druid.username=root
spring.datasource.druid.password=<your-password>

spring.redis.host=127.0.0.1
spring.redis.port=6379`,
    },
    {
        language: "properties",
        code: `physical_resource={your_home_path}/workspace/sparrow/sparrow-js/source`,
    },
    {
        language: "bash",
        code: `cd ~/workspace/sparrow/sparrow-coder/coder-main-spring-boot
mvn spring-boot:run`,
    },
];

export async function getCoderGuide(): Promise<CoderGuide> {
    const t = await getTranslations("website.products.coder.page.guide");
    return {
        requirements,
        repositories: repositoryNames.map((name, i) => ({
            name,
            role: t(`repositories.${i}.role`),
            href: `https://github.com/sparrowzoo/${name}`,
        })),
        setup: commands.map((command, i) => ({
            ...command,
            title: t(`setup.${i}.title`),
            description: t(`setup.${i}.description`),
            note: t(`setup.${i}.note`),
        })),
        workflow: t.raw("workflow") as {title: string; description: string}[],
        faq: t.raw("faq") as {question: string; answer: string}[],
        modules: moduleNames.map((name, i) => ({
            name,
            description: t(`modules.${i}.description`),
        })),
    };
}
