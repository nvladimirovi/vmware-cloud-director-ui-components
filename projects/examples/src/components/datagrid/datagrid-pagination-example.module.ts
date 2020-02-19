/*!
 * Copyright 2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DatagridModule } from '@vcd/ui-components';
import { DatagridPaginationExampleComponent } from './datagrid-pagination-example.component';

@NgModule({
    declarations: [DatagridPaginationExampleComponent],
    imports: [CommonModule, ClarityModule, ReactiveFormsModule, DatagridModule],
    exports: [DatagridPaginationExampleComponent],
    entryComponents: [DatagridPaginationExampleComponent],
})
export class DatagridPagionationExampleModule {}
