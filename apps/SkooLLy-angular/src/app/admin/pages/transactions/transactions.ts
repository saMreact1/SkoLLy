import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReceiptModal } from '../../components/modals/receipt-modal/receipt-modal';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transactions',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatTableModule,
    DecimalPipe,
    DatePipe,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions {
  displayedColumns: string[] = ['invoiceNo', 'student', 'amount', 'date', 'status', 'actions'];

  transactions = [
    {
      invoiceNo: 'INV-1001',
      studentName: 'John Doe',
      amount: 12000,
      date: new Date(),
      status: 'Success',
    },
    {
      invoiceNo: 'INV-1002',
      studentName: 'Grace Smith',
      amount: 8500,
      date: new Date(),
      status: 'Success',
    },
  ];

  searchQuery: string = '';
  statusFilter: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private dialog: MatDialog) {}

  viewReceipt(transaction: any) {
    this.dialog.open(ReceiptModal, {
      width: '600px',
      data: transaction
    });
  }

  get filteredTransactions() {
    return this.transactions.filter(tx => {
      const query = this.searchQuery.toLowerCase();
      const matchesSearch =
        tx.invoiceNo.toLowerCase().includes(query) ||
        tx.studentName.toLowerCase().includes(query);

      const matchesStatus = this.statusFilter
        ? tx.status.toLowerCase() === this.statusFilter.toLowerCase()
        : true;

      const matchesStart = this.startDate ? new Date(tx.date) >= this.startDate : true;
      const matchesEnd = this.endDate ? new Date(tx.date) <= this.endDate : true;

      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });
  }
}
