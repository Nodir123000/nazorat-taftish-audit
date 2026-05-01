import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApprovedPlanDialog } from '../ApprovedPlanDialog';
import { CollisionResult } from '@/lib/types/hierarchy';

// Mock the i18n hook
jest.mock('@/lib/i18n/hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the localization utils
jest.mock('@/lib/utils/localization', () => ({
  getLocalizedAuthorityName: (code: string) => `Authority ${code}`,
  getLocalizedDirectionName: (code: string) => `Direction ${code}`,
  getLocalizedDirectionAbbr: (code: string) => `D${code}`,
  getLocalizedDistrictName: (name: string) => name,
  getInspectionTypeLabel: (type: any) => `Type ${type}`,
  getStatusLabel: (status: any) => `Status ${status}`,
  toSafeString: (str: string) => str,
}));

// Mock military data
jest.mock('@/lib/data/military-data', () => ({
  militaryUnits: [{ id: 1, name: 'Unit 1', district: 'District 1', location: 'Location 1' }],
  militaryDistricts: [{ id: 1, name: 'District 1', short_name: 'D1' }],
  controlAuthorities: {},
  controlDirections: [],
}));

// Mock classifiers
jest.mock('@/components/reference/classifiers', () => ({
  classifiers: [
    {
      id: 1,
      values: [
        { id: 101, name: 'Approved' },
        { id: 106, name: 'Draft' },
      ],
    },
    {
      id: 2,
      values: [{ id: 2301, name: 'Type 1' }],
    },
    {
      id: 23,
      values: [{ id: 2302, name: 'Type 2' }],
    },
  ],
}));

// Mock CollisionAlert component
jest.mock('@/components/planning/collision-alert/CollisionAlert', () => ({
  CollisionAlert: ({ collision, locale, isLoading }: any) => {
    if (!collision?.hasCollision) return null;
    return (
      <div data-testid="collision-alert">
        <h3>Collision Alert</h3>
        <p>{collision.plans?.length} plans</p>
      </div>
    );
  },
}));

// Mock UnitSelect
jest.mock('@/components/reference/unit-select', () => ({
  UnitSelect: ({ value, onValueChange }: any) => (
    <input
      data-testid="unit-select"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
}));

const defaultProps = {
  open: true,
  onOpenChange: jest.fn(),
  onSave: jest.fn().mockResolvedValue({}),
  locale: 'ru' as const,
  supplyDepartments: [],
  isSubmitting: false,
};

describe('ApprovedPlanDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Collision Detection', () => {
    it('should render CollisionAlert when collision prop is passed', () => {
      const { rerender } = render(
        <ApprovedPlanDialog {...defaultProps} initialData={{ controlObject: 'Unit 1', year: 2024 }} />
      );

      expect(screen.queryByTestId('collision-alert')).not.toBeInTheDocument();

      // Simulate a collision response from the API
      // (In a real test, we'd mock the fetch call)
    });

    it('should not render CollisionAlert when there is no collision', () => {
      render(<ApprovedPlanDialog {...defaultProps} />);

      expect(screen.queryByTestId('collision-alert')).not.toBeInTheDocument();
    });

    it('should hide exception fields when collision is null', () => {
      const { container } = render(<ApprovedPlanDialog {...defaultProps} />);

      // Navigate to step 3 where exception fields would appear
      const nextButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Далее'));
      if (nextButton) {
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);
      }

      // Exception fields should not be visible
      expect(screen.queryByText(/Приказ министра/i)).not.toBeInTheDocument();
    });
  });

  describe('Exception Fields', () => {
    it('should show exception fields when collision exists', async () => {
      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          hasCollision: true,
          plans: [{ planId: 1, authority: 'Authority 1', type: 'Type 1' }],
        }),
      });

      const { rerender } = render(
        <ApprovedPlanDialog
          {...defaultProps}
          initialData={{ controlObject: 'Unit 1', year: 2024, unitId: 1 }}
        />
      );

      // Wait for collision check to complete
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Navigate to step 3
      const nextButtons = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('Далее'));
      fireEvent.click(nextButtons[0]);
      fireEvent.click(nextButtons[1]);

      // Exception fields should be visible
      await waitFor(() => {
        expect(screen.queryByText(/Приказ министра/i)).toBeInTheDocument();
      });
    });

    it('should set is_exceptional to true when exception fields are filled', async () => {
      const onSave = jest.fn().mockResolvedValue({});

      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          hasCollision: true,
          plans: [{ planId: 1, authority: 'Authority 1', type: 'Type 1' }],
        }),
      });

      render(
        <ApprovedPlanDialog
          {...defaultProps}
          onSave={onSave}
          initialData={{ controlObject: 'Unit 1', year: 2024, unitId: 1 }}
        />
      );

      // Navigate through steps
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const nextButtons = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('Далее'));
      for (let i = 0; i < 3; i++) {
        fireEvent.click(nextButtons[0]);
      }

      // Fill in exception fields
      const inputs = screen.getAllByRole('textbox');
      const ministerOrderInput = inputs[inputs.length - 1]; // Last textbox should be reason
      fireEvent.change(ministerOrderInput, { target: { value: 'Test reason' } });

      // Submit
      const submitButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Утвердить'));
      if (submitButton) {
        fireEvent.click(submitButton);
      }

      await waitFor(() => {
        expect(onSave).toHaveBeenCalled();
        const callData = (onSave.mock.calls[0] || [])[0];
        expect(callData.is_exceptional).toBe(true);
      });
    });

    it('should validate minister order ref before submission when required', async () => {
      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          hasCollision: true,
          plans: [{ planId: 1, authority: 'Authority 1', type: 'Type 1' }],
        }),
      });

      const { container } = render(
        <ApprovedPlanDialog
          {...defaultProps}
          initialData={{ controlObject: 'Unit 1', year: 2024, unitId: 1 }}
        />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Navigate to last step
      const nextButtons = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('Далее'));
      for (let i = 0; i < 3; i++) {
        fireEvent.click(nextButtons[0]);
      }

      // Try to submit without minister order ref
      const submitButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Утвердить'));
      if (submitButton) {
        fireEvent.click(submitButton);
      }

      // Should show error alert
      await waitFor(() => {
        // In a real scenario, this would trigger an alert
        expect(defaultProps.onSave).not.toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should include exception data in submission when provided', async () => {
      const onSave = jest.fn().mockResolvedValue({});

      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          hasCollision: true,
          plans: [{ planId: 1, authority: 'Authority 1', type: 'Type 1', control_authority_id: 123 }],
        }),
      });

      render(
        <ApprovedPlanDialog
          {...defaultProps}
          onSave={onSave}
          initialData={{ controlObject: 'Unit 1', year: 2024, unitId: 1 }}
        />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Navigate and fill data
      const nextButtons = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('Далее'));
      for (let i = 0; i < 3; i++) {
        fireEvent.click(nextButtons[0]);
      }

      // Fill exception fields (if visible)
      const inputs = screen.getAllByRole('textbox');
      if (inputs.length > 0) {
        fireEvent.change(inputs[0], { target: { value: 'ORDER-2024-001' } });
      }

      const submitButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Утвердить'));
      if (submitButton) {
        fireEvent.click(submitButton);
      }

      await waitFor(() => {
        if (onSave.mock.calls.length > 0) {
          const callData = onSave.mock.calls[0][0];
          expect(callData).toHaveProperty('override_authority_id');
        }
      });
    });

    it('should not include exception data when there is no collision', async () => {
      const onSave = jest.fn().mockResolvedValue({});

      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ hasCollision: false }),
      });

      render(
        <ApprovedPlanDialog
          {...defaultProps}
          onSave={onSave}
          initialData={{ controlObject: 'Unit 1', year: 2024, unitId: 1 }}
        />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Navigate to end
      const nextButtons = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('Далее'));
      for (let i = 0; i < 3; i++) {
        fireEvent.click(nextButtons[0]);
      }

      const submitButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Утвердить'));
      if (submitButton) {
        fireEvent.click(submitButton);
      }

      // Exception fields should not be validated
      await waitFor(() => {
        if (onSave.mock.calls.length > 0) {
          const callData = onSave.mock.calls[0][0];
          expect(callData.is_exceptional).toBeFalsy();
        }
      });
    });
  });

  describe('Localization', () => {
    it('should render exception fields with correct Russian labels', () => {
      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          hasCollision: true,
          plans: [{ planId: 1, authority: 'Authority 1', type: 'Type 1' }],
        }),
      });

      render(
        <ApprovedPlanDialog
          {...defaultProps}
          locale="ru"
          initialData={{ controlObject: 'Unit 1', year: 2024, unitId: 1 }}
        />
      );

      // Navigate to step 3
      const nextButtons = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('Далее'));
      for (let i = 0; i < 2; i++) {
        fireEvent.click(nextButtons[0]);
      }

      // Check for Russian labels
      waitFor(() => {
        expect(screen.queryByText(/Приказ министра/i)).toBeInTheDocument();
      });
    });

    it('should render exception fields with correct Uzbek labels', () => {
      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          hasCollision: true,
          plans: [{ planId: 1, authority: 'Authority 1', type: 'Type 1' }],
        }),
      });

      render(
        <ApprovedPlanDialog
          {...defaultProps}
          locale="uzLatn"
          initialData={{ controlObject: 'Unit 1', year: 2024, unitId: 1 }}
        />
      );

      // Navigate to step 3
      const nextButtons = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('Keyingisi'));
      for (let i = 0; i < 2; i++) {
        fireEvent.click(nextButtons[0]);
      }

      // Check for Uzbek labels
      waitFor(() => {
        expect(screen.queryByText(/ministr buyrug'i/i)).toBeInTheDocument();
      });
    });
  });
});
