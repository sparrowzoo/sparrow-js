import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, cp, rm, access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const script = fileURLToPath(new URL('../../copy-shared.mjs', import.meta.url));
const projects = ['sparrow-admin', 'sparrow-coder', 'sparrow-chat', 'sparrow-passport',
    '../shenzhen/everythingstore/lingcheuk-admin/front',
    '../shenzhen/everythingstore/lingcheuk-www/front/www'];

async function fixture(t) {
    const temporary = await mkdtemp(resolve(tmpdir(), 'sparrow-distribute-'));
    t.after(() => rm(temporary, {recursive: true, force: true}));
    const root = resolve(temporary, 'sparrow-js');
    for (const path of ['common/src/common/nested', 'common/src/sparrow', ...projects.map(p => `${p}/src`)]) {
        await mkdir(resolve(root, path), {recursive: true});
    }
    await cp(script, resolve(root, 'common/copy-shared.mjs'));
    await writeFile(resolve(root, 'common/src/common/nested/shared.ts'), 'shared');
    await writeFile(resolve(root, 'common/src/common/.hidden'), 'hidden');
    await writeFile(resolve(root, 'common/src/sparrow/menu.ts'), 'sparrow');
    const run = (...args) => spawnSync(process.execPath, [resolve(root, 'common/copy-shared.mjs'), ...args],
        {cwd: temporary, encoding: 'utf8'});
    return {root, run};
}

test('one invocation distributes all six sites, isolates business files and verifies copies', async t => {
    const {root, run} = await fixture(t);
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /6 个站点，10 个目录，16 个文件已核对/);
    for (const project of projects) {
        const src = resolve(root, project, 'src');
        assert.equal(await readFile(resolve(src, 'common/nested/shared.ts'), 'utf8'), 'shared');
        assert.equal(await readFile(resolve(src, 'common/.hidden'), 'utf8'), 'hidden');
        await assert.rejects(access(resolve(src, 'src/common')));
        if (project.startsWith('sparrow-')) {
            assert.equal(await readFile(resolve(src, 'sparrow/menu.ts'), 'utf8'), 'sparrow');
        } else {
            await assert.rejects(access(resolve(src, 'sparrow')));
        }
    }
    await writeFile(resolve(root, 'sparrow-admin/src/application.ts'), 'keep');
    await writeFile(resolve(root, 'common/src/common/nested/shared.ts'), 'updated');
    assert.equal(run().status, 0);
    assert.equal(await readFile(resolve(root, 'sparrow-admin/src/common/nested/shared.ts'), 'utf8'), 'updated');
    assert.equal(await readFile(resolve(root, 'sparrow-admin/src/application.ts'), 'utf8'), 'keep');
});

test('dry run writes nothing; selecting sites does not distribute elsewhere', async t => {
    const {root, run} = await fixture(t);
    assert.equal(run('--dry-run').status, 0);
    for (const project of projects) await assert.rejects(access(resolve(root, project, 'src/common')));
    const result = run('sparrow-chat', 'sparrow-chat');
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /1 个站点/);
    await access(resolve(root, 'sparrow-chat/src/sparrow/menu.ts'));
    await assert.rejects(access(resolve(root, 'sparrow-passport/src/common')));
});

test('missing and unknown targets fail before any write', async t => {
    const {root, run} = await fixture(t);
    assert.notEqual(run('sparrow-admin', 'typo').status, 0);
    await assert.rejects(access(resolve(root, 'sparrow-admin/src/common')));
    await rm(resolve(root, projects[5], 'src'), {recursive: true});
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /目录不存在/);
    await assert.rejects(access(resolve(root, 'sparrow-admin/src/common')));
});
