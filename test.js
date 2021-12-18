/* eslint-env jest */

'use strict'

const promRegister = require('prom-client').register
const PromRegistry = require('prom-client').Registry
const gcMetrics = require('./index')

jest.mock('gc-stats')

afterEach(() => {
  promRegister.clear()
})

test('register metrics', async () => {
  expect(await promRegister.getMetricsAsJSON()).toStrictEqual([])

  gcMetrics()

  expect(await promRegister.getMetricsAsJSON()).toHaveLength(3)
})

test('register metrics to custom register', async () => {
  const register = new PromRegistry()

  expect(await promRegister.getMetricsAsJSON()).toStrictEqual([])
  expect(await register.getMetricsAsJSON()).toStrictEqual([])

  gcMetrics(register)

  expect(await promRegister.getMetricsAsJSON()).toStrictEqual([])
  expect(await register.getMetricsAsJSON()).toHaveLength(3)
})

test('include prefix', async () => {
  expect(await promRegister.getMetricsAsJSON()).toStrictEqual([])

  gcMetrics(undefined, { prefix: 'prefix_' })

  expect(await promRegister.getMetricsAsJSON()).toHaveLength(3)

  expect((await promRegister.getMetricsAsJSON()).map(metric => metric.name)).toEqual([
    'prefix_nodejs_gc_runs_total',
    'prefix_nodejs_gc_pause_seconds_total',
    'prefix_nodejs_gc_reclaimed_bytes_total'
  ])
})
