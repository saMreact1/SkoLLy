import { MatMenuModule } from '@angular/material/menu';
import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateInvoiceModal } from '../../components/modals/create-invoice-modal/create-invoice-modal';
import { ViewInvoiceModal } from '../../components/modals/view-invoice-modal/view-invoice-modal';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe, DecimalPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-invoices',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    DatePipe,
    DecimalPipe,
    NgIf
  ],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss'
})
export class Invoices {
  invoices = [
    {
      invoiceNo: 'INV-001',
      studentName: 'Samuel Adeleke',
      class: 'JSS 1',
      amount: 45000,
      dueDate: new Date('2025-08-10'),
      status: 'Pending'
    },
    {
      invoiceNo: 'INV-002',
      studentName: 'Jane Doe',
      class: 'SSS 2',
      amount: 50000,
      dueDate: new Date('2025-07-15'),
      status: 'Paid'
    }
  ];

  displayedColumns = ['invoiceNo', 'student', 'amount', 'dueDate', 'status', 'actions'];

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Paid': return 'primary';
      case 'Pending': return 'accent';
      case 'Overdue': return 'warn';
      default: return 'accent';
    }
  }

  openCreateInvoiceModal() {
    const dialogRef = this.dialog.open(CreateInvoiceModal, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.invoices.push(result); 
      }
    });
  }

  viewInvoice(invoice: any) {
    this.dialog.open(ViewInvoiceModal, {
      width: '600px',
      data: invoice
    })
  }

  markAsPaid(invoice: any) {
    invoice.status = 'Paid';

    this.snack.open(`✅ Invoice ${invoice.invoiceNo} marked as Paid`, 'Close', {
      duration: 3000,
      panelClass: 'snackbar-success'
    });
  }

  deleteInvoice(invoice: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Invoice',
        message: `Are you sure you want to delete invoice #${invoice.invoiceNo}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.invoices = this.invoices.filter(i => i.invoiceNo !== invoice.invoiceNo);
        this.snack.open(`🗑️ Invoice ${invoice.invoiceNo} deleted`, 'Close', {
          duration: 3000,
          panelClass: 'snackbar-warn'
        });
      }
    });
  }
}
