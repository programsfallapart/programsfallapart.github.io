import { describe, it } from 'node:test'
import { deepStrictEqual } from 'node:assert'
import type { Suite, TestCase, TestResult } from '@playwright/test/reporter'
import ProgressReporter from './progress-reporter'

const red = (s: string) => `\x1b[31m${s}\x1b[0m`

function makeSuite(count: number): Suite {
  return {
    allTests: () => Array.from({ length: count }) as TestCase[],
  } as Suite
}

function makeTestCase(opts: {
  outcome: string
  titlePath?: string[]
  file?: string
  line?: number
  retries?: number
}): TestCase {
  return {
    outcome: () => opts.outcome,
    titlePath: () => opts.titlePath ?? ['', 'suite', 'test'],
    location: { file: opts.file ?? 'test.spec.ts', line: opts.line ?? 1 },
    retries: opts.retries ?? 0,
  } as TestCase
}

function makeResult(opts: {
  status: string
  retry?: number
  errors?: { message?: string; stack?: string }[]
}): TestResult {
  return {
    status: opts.status,
    retry: opts.retry ?? 0,
    errors: opts.errors ?? [],
  } as TestResult
}

function captureOutput(fn: () => void): string[] {
  const lines: string[] = []
  const original = console.log
  console.log = (...args: unknown[]) => lines.push(args.join(' '))
  try {
    fn()
  } finally {
    console.log = original
  }
  return lines
}

describe('ProgressReporter', () => {
  it('all tests passing prints progress at 10% intervals', () => {
    const reporter = new ProgressReporter()
    const lines = captureOutput(() => {
      reporter.onBegin({} as never, makeSuite(20))
      for (let i = 0; i < 20; i++) {
        reporter.onTestEnd(
          makeTestCase({ outcome: 'expected' }),
          makeResult({ status: 'passed' }),
        )
      }
      reporter.onEnd()
    })

    deepStrictEqual(lines, [
      '[progress] [------------------------] 0/20 — failed: 0',
      '[progress] [##----------------------] 2/20 — failed: 0',
      '[progress] [#####-------------------] 4/20 — failed: 0',
      '[progress] [#######-----------------] 6/20 — failed: 0',
      '[progress] [##########--------------] 8/20 — failed: 0',
      '[progress] [############------------] 10/20 — failed: 0',
      '[progress] [##############----------] 12/20 — failed: 0',
      '[progress] [#################-------] 14/20 — failed: 0',
      '[progress] [###################-----] 16/20 — failed: 0',
      '[progress] [######################--] 18/20 — failed: 0',
      '[progress] [########################] 20/20 — failed: 0',
    ])
  })

  it('mixed pass and fail prints failure summary', () => {
    const reporter = new ProgressReporter()
    const lines = captureOutput(() => {
      reporter.onBegin({} as never, makeSuite(10))

      for (let i = 0; i < 8; i++) {
        reporter.onTestEnd(
          makeTestCase({ outcome: 'expected' }),
          makeResult({ status: 'passed' }),
        )
      }

      reporter.onTestEnd(
        makeTestCase({
          outcome: 'unexpected',
          titlePath: ['', 'layout', 'header is visible'],
          file: 'tests/layout.spec.ts',
          line: 12,
        }),
        makeResult({ status: 'failed', errors: [{ message: 'Expected element to be visible' }] }),
      )

      reporter.onTestEnd(
        makeTestCase({
          outcome: 'unexpected',
          titlePath: ['', 'content', 'TOC links match headings'],
          file: 'tests/content.spec.ts',
          line: 45,
        }),
        makeResult({ status: 'failed', errors: [{ message: 'Timed out waiting for expect' }] }),
      )

      reporter.onEnd()
    })

    deepStrictEqual(lines, [
      '[progress] [------------------------] 0/10 — failed: 0',
      '[progress] [##----------------------] 1/10 — failed: 0',
      '[progress] [#####-------------------] 2/10 — failed: 0',
      '[progress] [#######-----------------] 3/10 — failed: 0',
      '[progress] [##########--------------] 4/10 — failed: 0',
      '[progress] [############------------] 5/10 — failed: 0',
      '[progress] [##############----------] 6/10 — failed: 0',
      '[progress] [#################-------] 7/10 — failed: 0',
      '[progress] [###################-----] 8/10 — failed: 0',
      `[progress] [######################--] 9/10 — ${red('failed: 1')}`,
      `[progress] [########################] 10/10 — ${red('failed: 2')}`,
      '\n--- 2 failed tests ---\n',
      '  FAIL  layout > header is visible',
      '        tests/layout.spec.ts:12',
      '        Expected element to be visible',
      '',
      '  FAIL  content > TOC links match headings',
      '        tests/content.spec.ts:45',
      '        Timed out waiting for expect',
      '',
    ])
  })

  it('exhausted retries counts failure only once on final attempt', () => {
    const reporter = new ProgressReporter()
    const failCase = makeTestCase({
      outcome: 'unexpected',
      titlePath: ['', 'suite', 'flaky test'],
      file: 'test.spec.ts',
      line: 5,
      retries: 1,
    })
    const lines = captureOutput(() => {
      reporter.onBegin({} as never, makeSuite(1))

      // First attempt fails — not final (retry 0 < retries 1)
      reporter.onTestEnd(failCase, makeResult({ status: 'failed', retry: 0 }))

      // Final retry also fails — counted now
      reporter.onTestEnd(
        failCase,
        makeResult({ status: 'failed', retry: 1, errors: [{ message: 'Still broken' }] }),
      )

      reporter.onEnd()
    })

    deepStrictEqual(lines, [
      '[progress] [------------------------] 0/1 — failed: 0',
      `[progress] [########################] 1/1 — ${red('failed: 1')}`,
      '\n--- 1 failed test ---\n',
      '  FAIL  suite > flaky test',
      '        test.spec.ts:5',
      '        Still broken',
      '',
    ])
  })

  it('skipped tests are counted', () => {
    const reporter = new ProgressReporter()
    const lines = captureOutput(() => {
      reporter.onBegin({} as never, makeSuite(5))

      for (let i = 0; i < 3; i++) {
        reporter.onTestEnd(
          makeTestCase({ outcome: 'expected' }),
          makeResult({ status: 'passed' }),
        )
      }

      for (let i = 0; i < 2; i++) {
        reporter.onTestEnd(
          makeTestCase({ outcome: 'skipped' }),
          makeResult({ status: 'skipped' }),
        )
      }

      reporter.onEnd()
    })

    deepStrictEqual(lines, [
      '[progress] [------------------------] 0/5 — failed: 0',
      '[progress] [#####-------------------] 1/5 — failed: 0',
      '[progress] [##########--------------] 2/5 — failed: 0',
      '[progress] [##############----------] 3/5 — failed: 0',
      '[progress] [###################-----] 4/5 — failed: 0',
      '[progress] [########################] 5/5 — failed: 0',
    ])
  })
})
