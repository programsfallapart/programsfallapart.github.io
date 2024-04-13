const { readdir, readFile, writeFile } = require('fs/promises')
const { resolve } = require('path')
const { stringify } = require('yaml')
const matter = require('gray-matter')

const postPath = resolve(__dirname, './src/content/posts')

const updateMatter = async () => {

  const posts = (await readdir(postPath)).filter((f) => f.endsWith('.md'))

  await Promise.all(
    posts.map(async (file) => {
      const filePath = resolve(__dirname, `${postPath}/${file}`)
      const { data, content } = matter(await readFile(filePath))
      delete data['category']
      const newContent = `---\n${stringify(data)}---\n${content}`
      await writeFile(filePath, newContent)
    }),
  )
}

updateMatter()
