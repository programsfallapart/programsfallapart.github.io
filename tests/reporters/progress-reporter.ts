import type { Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter'

interface Failure {
  title: string
  location: string
  error: string
}

class ProgressReporter implements Reporter {
  private total = 0
  private done = 0
  private failed = 0
  private readonly barWidth = 24
  private readonly failures: Failure[] = []
  private lastPrintedPercent = -1

  onBegin(_config: unknown, suite: Suite): void {
    this.total = suite.allTests().length
    this.lastPrintedPercent = 0
    this.printProgress()
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (!this.isFinalAttempt(test, result)) return

    this.done += 1
    if (test.outcome() === 'unexpected') {
      this.failed += 1
      this.failures.push({
        title: test.titlePath().slice(1).join(' > '),
        location: `${test.location.file}:${test.location.line}`,
        error: result.errors.map(e => e.message ?? e.stack ?? '').join('\n').trim(),
      })
    }

    const percent = Math.floor((this.done / this.total) * 10) * 10
    if (percent > this.lastPrintedPercent || this.done === this.total) {
      this.lastPrintedPercent = percent
      this.printProgress()
    }
  }

  onEnd(): void {
    if (this.failures.length === 0) return

    console.log(`\n--- ${this.failures.length} failed test${this.failures.length > 1 ? 's' : ''} ---\n`)
    for (const f of this.failures) {
      console.log(`  FAIL  ${f.title}`)
      console.log(`        ${f.location}`)
      console.log(`        ${f.error.split('\n')[0]}`)
      console.log()
    }
  }

  private isFinalAttempt(test: TestCase, result: TestResult): boolean {
    if (result.status === 'passed' || result.status === 'skipped' || result.status === 'interrupted') {
      return true
    }

    return result.retry >= test.retries
  }

  private printProgress(): void {
    const ratio = this.total > 0 ? this.done / this.total : 1
    const filled = Math.round(ratio * this.barWidth)
    const empty = this.barWidth - filled
    const bar = `${'#'.repeat(filled)}${'-'.repeat(empty)}`

    const failedText = this.failed > 0
      ? `\x1b[31mfailed: ${this.failed}\x1b[0m`
      : `failed: ${this.failed}`

    console.log(`[progress] [${bar}] ${this.done}/${this.total} — ${failedText}`)
  }
}

export default ProgressReporter
