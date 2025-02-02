/*!
 * Copyright 2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { TestBed } from '@angular/core/testing';
import { CsvExporterService } from './csv-exporter.service';

describe('CsvExporterService', () => {
    describe('hasPotentialInjection', () => {
        it('doesnt detect injection on a row without formulas', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(
                service.hasPotentialInjection([
                    ['a+', 'b'],
                    [1, 2],
                ])
            ).toBeFalsy();
        });

        it('does detect injection on a row with formulas', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(
                service.hasPotentialInjection([
                    ['+', 'b'],
                    [1, 2],
                ])
            ).toBeTruthy();
            expect(
                service.hasPotentialInjection([
                    ['-', 'b'],
                    [1, 2],
                ])
            ).toBeTruthy();
            expect(
                service.hasPotentialInjection([
                    ['=', 'b'],
                    [1, 2],
                ])
            ).toBeTruthy();
            expect(
                service.hasPotentialInjection([
                    ['@', 'b'],
                    [1, 2],
                ])
            ).toBeTruthy();
        });
    });
    // Byte order mark for UTF-8
    const BOM = '\ufeff';
    describe('createCsv', () => {
        it('adds an UTF-8 BOM mark so it can be opened when non ASCII characters are present', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(service.createCsv([['a'], [1]])).toEqual(BOM + 'a\n1');
        });
        it('creates a csv out of 2D array of cell values', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(
                service.createCsv([
                    ['a', 'b'],
                    [1, 2],
                ])
            ).toEqual(BOM + 'a,b\n1,2');
        });

        it('encodes new lines by wrapping with double quotes', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(
                service.createCsv([
                    ['a', 'b'],
                    ['1\n1', 2],
                ])
            ).toEqual(BOM + 'a,b\n"1\n1",2');
        });

        it('encodes commas by wrapping with double quotes', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(
                service.createCsv([
                    ['a', 'b'],
                    ['1,1', 2],
                ])
            ).toEqual(BOM + 'a,b\n"1,1",2');
        });

        it('encodes double quotes with ""', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(
                service.createCsv([
                    ['a', 'b'],
                    ['1"2', 2],
                ])
            ).toEqual(BOM + 'a,b\n"1""2",2');
        });

        it('encodes dates with locale strings', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            const date = new Date(0);
            const localeString = date.toLocaleString();
            expect(
                service.createCsv([
                    ['a', 'b'],
                    [date, 2],
                ])
            ).toEqual(`${BOM}a,b
"${localeString}",2`);
        });

        it('prints null and undefined as an empty string', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(
                service.createCsv([
                    ['a', 'b'],
                    [null, undefined],
                ])
            ).toEqual(BOM + 'a,b\n,');
        });

        it('adds a tab character if the value begins with any special characters', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(
                service.createCsv(
                    [
                        ['+', '-', '@', '='],
                        [null, undefined],
                    ],
                    true
                )
            ).toEqual(BOM + '\t+,\t-,\t@,\t=\n,');
        });

        it('does not add a tab character if the value contains but does not begin with with any special characters', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(
                service.createCsv(
                    [
                        ['a+', 'a-', 'a@', 'a='],
                        [null, undefined],
                    ],
                    true
                )
            ).toEqual(BOM + 'a+,a-,a@,a=\n,');
        });

        it('encodes JavaScript object to JSON string', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            expect(
                service.createCsv([
                    ['a', 'b', 'c'],
                    [{ a: 1, b: 2 }, [1, 2], 10],
                ])
            ).toEqual(BOM + 'a,b,c\n"{""a"":1,""b"":2}","[1,2]",10');
        });
    });

    describe('downloadCsvFile - creating a link', () => {
        it('creates and clicks an invisible link', () => {
            const service: CsvExporterService = TestBed.inject(CsvExporterService);
            const rows = [
                ['a', 'b'],
                ['1"2', 2],
                [3, 4],
            ];
            const csvString = service.createCsv(rows);
            spyOn(document.body, 'appendChild');
            spyOn(document.body, 'removeChild');
            const linkSpy = jasmine.createSpyObj('linkSpy', ['click', 'setAttribute', 'style']);
            spyOn(document, 'createElement').and.returnValue(linkSpy);
            service.downloadCsvFile(csvString, 'test');
            expect(document.body.appendChild).toHaveBeenCalled();
            expect(document.body.removeChild).toHaveBeenCalled();
            expect(linkSpy.click).toHaveBeenCalled();
            expect(linkSpy.setAttribute).toHaveBeenCalled();
            expect(linkSpy.style.visibility).toBe('hidden');
        });
    });
});
