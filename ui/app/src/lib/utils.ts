/*
 * Copyright 2021 Chaos Mesh Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import _ from 'lodash'

export function objToArrBySep(obj: Record<string, string | string[]>, separator: string, filters?: string[]) {
  return Object.entries(obj)
    .filter((d) => !filters?.includes(d[0]))
    .reduce(
      (acc: string[], [key, val]) =>
        acc.concat(Array.isArray(val) ? val.map((d) => `${key}${separator}${d}`) : `${key}${separator}${val}`),
      []
    )
}

export function arrToObjBySep(arr: string[], sep: string): Record<string, string> {
  const result: any = {}

  arr.forEach((d) => {
    const split = d.split(sep)

    result[split[0]] = split[1]
  })

  return result
}

/**
 * Recursively check if a value is empty.
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isDeepEmpty(value: any): boolean {
  if (!value) {
    return true
  }

  if (_.isArray(value) && _.isEmpty(value)) {
    return true
  }

  if (_.isObject(value)) {
    return _.every(value, isDeepEmpty)
  }

  return false
}

/**
 * Remove empty values from nested object.
 *
 * @export
 * @param {*} obj
 */
export function sanitize(obj: any) {
  return JSON.parse(JSON.stringify(obj, (_, value: any) => (isDeepEmpty(value) ? undefined : value)) ?? '{}')
}

export function concatKindAction(kind: string, action?: string) {
  return `${kind}${action ? ` / ${action}` : ''}`
}
