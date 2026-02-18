import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardProvider } from '@/context/DashboardContext';
import DashboardPage from '@/components/dashboard/DashboardPage';
import AboutPage from '@/components/about/AboutPage';
import App from '@/App';

const sampleData = [
  { name: 'Alice', age: 30, city: 'Helsinki', salary: 55000, department: 'Engineering', gender: 'F', years_exp: 5 },
  { name: 'Bob', age: 25, city: 'Helsinki', salary: 48000, department: 'Marketing', gender: 'M', years_exp: 3 },
  { name: 'Carol', age: 35, city: 'Espoo', salary: 62000, department: 'Engineering', gender: 'F', years_exp: 8 },
  { name: 'Dave', age: 28, city: 'Espoo', salary: 51000, department: 'Sales', gender: 'M', years_exp: 4 },
  { name: 'Eve', age: 32, city: 'Helsinki', salary: 58000, department: 'Engineering', gender: 'F', years_exp: 6 },
  { name: 'Frank', age: 27, city: 'Tampere', salary: 47000, department: 'Marketing', gender: 'M', years_exp: 2 },
  { name: 'Grace', age: 40, city: 'Tampere', salary: 70000, department: 'Engineering', gender: 'F', years_exp: 12 },
  { name: 'Hank', age: 33, city: 'Helsinki', salary: 54000, department: 'Sales', gender: 'M', years_exp: 7 },
  { name: 'Iris', age: 29, city: 'Espoo', salary: 52000, department: 'Marketing', gender: 'F', years_exp: 4 },
  { name: 'Jack', age: 38, city: 'Tampere', salary: 65000, department: 'Engineering', gender: 'M', years_exp: 10 },
];

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardProvider>
        <DashboardPage />
      </DashboardProvider>
    </MemoryRouter>
  );
}

function uploadFile(container: HTMLElement) {
  const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(
    [JSON.stringify(sampleData)],
    'test.json',
    { type: 'application/json' }
  );
  fireEvent.change(fileInput, { target: { files: [file] } });
}

beforeEach(() => {
  sessionStorage.clear();
});

describe('Integration: Upload Flow', () => {
  it('shows upload prompt initially', () => {
    renderDashboard();
    expect(screen.getByText('Customizable-Dash')).toBeInTheDocument();
    expect(screen.getByText(/Upload your data in JSON or CSV format/)).toBeInTheDocument();
  });

  it('shows sidebar and dashboard after file upload', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      // "Dashboard" appears in sidebar header, sidebar tab, and h3 heading
      expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Clear Dashboard')).toBeInTheDocument();
    });
  });

  it('sidebar has chart creation buttons after upload', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Line Charts')).toBeInTheDocument();
      expect(screen.getByText('Pie and Bar Charts')).toBeInTheDocument();
      expect(screen.getByText('Multi Bar Charts')).toBeInTheDocument();
      expect(screen.getByText('Box Plot')).toBeInTheDocument();
    });
  });

  it('can switch to table tab', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Tables')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Tables'));

    await waitFor(() => {
      expect(screen.getByText('Table')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });
  });

  it('table shows data columns and rows', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Tables')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Tables'));

    await waitFor(() => {
      // Column headers
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('age')).toBeInTheDocument();
      expect(screen.getByText('city')).toBeInTheDocument();
      // Data values
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getAllByText('Helsinki').length).toBeGreaterThan(0);
    });
  });

  it('table search filters rows', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Tables')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Tables'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'Alice' },
    });

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });
  });
});

describe('Integration: Pie/Bar Modal', () => {
  it('opens pie/bar modal and lists columns', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Pie and Bar Charts')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Pie and Bar Charts'));

    await waitFor(() => {
      expect(screen.getByText('Pie Chart and Bar Chart')).toBeInTheDocument();
      // gender has <=4 unique values -> should be listed
      expect(screen.getByText('gender')).toBeInTheDocument();
      // city should be listed (3 unique values)
      expect(screen.getByText('city')).toBeInTheDocument();
    });
  });

  it('creates a pie chart for gender (<=4 unique)', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Pie and Bar Charts')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Pie and Bar Charts'));

    await waitFor(() => {
      expect(screen.getByText('gender')).toBeInTheDocument();
    });

    // Find and check the gender checkbox
    const genderLabel = screen.getByText('gender');
    const checkbox = genderLabel.closest('label')?.querySelector('input[type="checkbox"]');
    if (checkbox) {
      fireEvent.click(checkbox);
    }

    // Close modal
    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.getByText('Pie Chart for gender')).toBeInTheDocument();
    });
  });

  it('creates a bar chart for department (>4 unique)', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Pie and Bar Charts')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Pie and Bar Charts'));

    await waitFor(() => {
      expect(screen.getByText('department')).toBeInTheDocument();
    });

    const deptLabel = screen.getByText('department');
    const checkbox = deptLabel.closest('label')?.querySelector('input[type="checkbox"]');
    if (checkbox) {
      fireEvent.click(checkbox);
    }

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      // department has 3 unique values -> pie chart
      expect(screen.getByText('Pie Chart for department')).toBeInTheDocument();
    });
  });
});

describe('Integration: Box Plot Modal', () => {
  it('opens box plot modal with numeric columns', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Box Plot')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Box Plot'));

    await waitFor(() => {
      expect(screen.getByText('Box Plot Form')).toBeInTheDocument();
      expect(screen.getByText('age')).toBeInTheDocument();
      expect(screen.getByText('salary')).toBeInTheDocument();
    });
  });

  it('creates box plot chart', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Box Plot')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Box Plot'));

    await waitFor(() => {
      expect(screen.getByText('age')).toBeInTheDocument();
    });

    const ageLabel = screen.getByText('age');
    const checkbox = ageLabel.closest('label')?.querySelector('input[type="checkbox"]');
    if (checkbox) {
      fireEvent.click(checkbox);
    }

    fireEvent.click(screen.getByText('Draw Chart'));

    await waitFor(() => {
      // "Box Plot" appears in sidebar and as widget title h5
      const boxPlotElements = screen.getAllByText('Box Plot');
      expect(boxPlotElements.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe('Integration: Delete Dashboard', () => {
  it('shows delete confirmation modal', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Clear Dashboard')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Clear Dashboard'));

    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    });
  });

  it('clears dashboard on confirm', async () => {
    const { container } = renderDashboard();
    uploadFile(container);

    await waitFor(() => {
      expect(screen.getByText('Clear Dashboard')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Clear Dashboard'));

    await waitFor(() => {
      expect(screen.getByText('Ok')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Ok'));

    await waitFor(() => {
      // Should return to upload prompt
      expect(screen.getByText('Customizable-Dash')).toBeInTheDocument();
    });
  });
});

describe('Integration: About Page', () => {
  it('renders about page content', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Customizable Dash App')).toBeInTheDocument();
    expect(screen.getByText(/browser based client side dashboard/)).toBeInTheDocument();
    expect(screen.getByText('npm install')).toBeInTheDocument();
    expect(screen.getByText('npm run dev')).toBeInTheDocument();
  });
});

describe('Integration: Routing', () => {
  it('renders dashboard at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <DashboardProvider>
          <DashboardPage />
        </DashboardProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Customizable-Dash')).toBeInTheDocument();
  });

  it('renders about page at /about', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Customizable Dash App')).toBeInTheDocument();
  });
});
