import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  DashboardState,
  DashboardAction,
  Widget,
  LayoutItem,
} from '@/types';
import { analyzeColumns } from '@/utils/dataAnalysis';
import { useDashboardPersistence, useAutoSave } from '@/hooks/useDashboardPersistence';
import { useGridLayout } from '@/hooks/useGridLayout';

const initialState: DashboardState = {
  data: null,
  widgets: [],
  layouts: [],
  analysis: null,
};

function reducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'LOAD_DATA': {
      const analysis = analyzeColumns(action.payload);
      return { ...state, data: action.payload, analysis };
    }
    case 'ADD_WIDGET':
      return {
        ...state,
        widgets: [...state.widgets, action.payload],
      };
    case 'REMOVE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.filter((w) => w.id !== action.payload),
        layouts: state.layouts.filter((l) => l.i !== action.payload),
      };
    case 'UPDATE_LAYOUTS':
      return { ...state, layouts: action.payload };
    case 'RESTORE_DASHBOARD': {
      const analysis = analyzeColumns(action.payload.data);
      return {
        data: action.payload.data,
        widgets: action.payload.widgets,
        layouts: action.payload.layouts,
        analysis,
      };
    }
    case 'CLEAR_ALL':
      return initialState;
    default:
      return state;
  }
}

interface DashboardContextValue {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  loadData: (data: Record<string, unknown>[]) => void;
  addWidget: (widget: Omit<Widget, 'id'>) => void;
  removeWidget: (id: string) => void;
  updateLayouts: (layouts: LayoutItem[]) => void;
  clearDashboard: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { restoreSession, persistData, clearSession } = useDashboardPersistence();
  const { createLayoutItem } = useGridLayout();

  // Restore session on mount
  useEffect(() => {
    const { data, widgets, layouts } = restoreSession();
    if (data && data.length > 0) {
      dispatch({
        type: 'RESTORE_DASHBOARD',
        payload: { data, widgets, layouts },
      });
    }
  }, [restoreSession]);

  // Auto-save widgets/layouts on change
  useAutoSave(state.widgets, state.layouts, state.data !== null);

  const loadData = useCallback(
    (data: Record<string, unknown>[]) => {
      persistData(data);
      dispatch({ type: 'LOAD_DATA', payload: data });
    },
    [persistData]
  );

  const addWidget = useCallback(
    (widget: Omit<Widget, 'id'>) => {
      const id = crypto.randomUUID();
      const layoutItem = createLayoutItem(id, state.layouts);
      dispatch({
        type: 'ADD_WIDGET',
        payload: { ...widget, id },
      });
      dispatch({
        type: 'UPDATE_LAYOUTS',
        payload: [...state.layouts, layoutItem],
      });
    },
    [createLayoutItem, state.layouts]
  );

  const removeWidget = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_WIDGET', payload: id });
  }, []);

  const updateLayouts = useCallback((layouts: LayoutItem[]) => {
    dispatch({ type: 'UPDATE_LAYOUTS', payload: layouts });
  }, []);

  const clearDashboard = useCallback(() => {
    clearSession();
    dispatch({ type: 'CLEAR_ALL' });
  }, [clearSession]);

  return (
    <DashboardContext.Provider
      value={{
        state,
        dispatch,
        loadData,
        addWidget,
        removeWidget,
        updateLayouts,
        clearDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
