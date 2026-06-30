import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { createContext, useState, useCallback, useMemo, Children, isValidElement, useRef, useEffect, useContext } from 'react';
import { useWatch, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { e as editAthleteSchema, r as registerAthleteSchema, b as editCoachSchema, c as registerCoachSchema } from './authSchemas_Bk0fpIi0.mjs';
import { b as saveAthlete, s as saveProfessor } from './supabase_DtntKppG.mjs';
import { D as DISCAPACIDADES } from './classes_Da4MgPJU.mjs';
import { B as Button } from './button_CfI8z-VA.mjs';
import { LoaderCircle, Check, ChevronLeft, Save, ChevronRight } from 'lucide-react';
import { c as cn } from './utils_B05Dmz_H.mjs';
import { AlertDialog as AlertDialog$1 } from 'radix-ui';

const StepperContext = createContext(void 0);
const StepItemContext = createContext(
  void 0
);
function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used within a Stepper");
  return ctx;
}
function useStepItem() {
  const ctx = useContext(StepItemContext);
  if (!ctx) throw new Error("useStepItem must be used within a StepperItem");
  return ctx;
}
function Stepper({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = "horizontal",
  className,
  children,
  indicators = {},
  ...props
}) {
  const [activeStep, setActiveStep] = useState(defaultValue);
  const [triggerNodes, setTriggerNodes] = useState([]);
  const registerTrigger = useCallback((node) => {
    setTriggerNodes((prev) => {
      if (node && !prev.includes(node)) {
        return [...prev, node];
      } else if (!node && prev.includes(node)) {
        return prev.filter((n) => n !== node);
      } else {
        return prev;
      }
    });
  }, []);
  const handleSetActiveStep = useCallback(
    (step) => {
      if (value === void 0) {
        setActiveStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange]
  );
  const currentStep = value ?? activeStep;
  const focusTrigger = (idx) => {
    if (triggerNodes[idx]) triggerNodes[idx].focus();
  };
  const focusNext = (currentIdx) => focusTrigger((currentIdx + 1) % triggerNodes.length);
  const focusPrev = (currentIdx) => focusTrigger((currentIdx - 1 + triggerNodes.length) % triggerNodes.length);
  const focusFirst = () => focusTrigger(0);
  const focusLast = () => focusTrigger(triggerNodes.length - 1);
  const contextValue = useMemo(
    () => ({
      activeStep: currentStep,
      setActiveStep: handleSetActiveStep,
      stepsCount: Children.toArray(children).filter(
        (child) => isValidElement(child) && child.type.displayName === "StepperItem"
      ).length,
      orientation,
      registerTrigger,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
      triggerNodes,
      indicators
    }),
    [
      currentStep,
      handleSetActiveStep,
      children,
      orientation,
      registerTrigger,
      triggerNodes
    ]
  );
  return /* @__PURE__ */ jsx(StepperContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(
    "div",
    {
      role: "tablist",
      "aria-orientation": orientation,
      "data-slot": "stepper",
      className: cn("w-full", className),
      "data-orientation": orientation,
      ...props,
      children
    }
  ) });
}
function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}) {
  const { activeStep } = useStepper();
  const state = completed || step < activeStep ? "completed" : activeStep === step ? "active" : "inactive";
  const isLoading = loading && step === activeStep;
  return /* @__PURE__ */ jsx(
    StepItemContext.Provider,
    {
      value: { step, state, isDisabled: disabled, isLoading },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          "data-slot": "stepper-item",
          className: cn(
            "group/step flex items-center justify-center not-last:flex-1 group-data-[orientation=horizontal]/stepper-nav:flex-row group-data-[orientation=vertical]/stepper-nav:flex-col",
            className
          ),
          "data-state": state,
          ...isLoading ? { "data-loading": true } : {},
          ...props,
          children
        }
      )
    }
  );
}
function StepperTrigger({
  asChild = false,
  className,
  children,
  tabIndex,
  ...props
}) {
  const { state, isLoading } = useStepItem();
  const stepperCtx = useStepper();
  const {
    setActiveStep,
    activeStep,
    registerTrigger,
    triggerNodes,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast
  } = stepperCtx;
  const { step, isDisabled } = useStepItem();
  const isSelected = activeStep === step;
  const id = `stepper-tab-${step}`;
  const panelId = `stepper-panel-${step}`;
  const btnRef = useRef(null);
  useEffect(() => {
    if (btnRef.current) {
      registerTrigger(btnRef.current);
    }
  }, [btnRef.current]);
  const myIdx = useMemo(
    () => triggerNodes.findIndex((n) => n === btnRef.current),
    [triggerNodes, btnRef.current]
  );
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        if (myIdx !== -1 && focusNext) focusNext(myIdx);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        if (myIdx !== -1 && focusPrev) focusPrev(myIdx);
        break;
      case "Home":
        e.preventDefault();
        if (focusFirst) focusFirst();
        break;
      case "End":
        e.preventDefault();
        if (focusLast) focusLast();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        setActiveStep(step);
        break;
    }
  };
  if (asChild) {
    return /* @__PURE__ */ jsx(
      "span",
      {
        "data-slot": "stepper-trigger",
        "data-state": state,
        className,
        children
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      ref: btnRef,
      role: "tab",
      id,
      "aria-selected": isSelected,
      "aria-controls": panelId,
      tabIndex: typeof tabIndex === "number" ? tabIndex : isSelected ? 0 : -1,
      "data-slot": "stepper-trigger",
      "data-state": state,
      "data-loading": isLoading,
      className: cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 inline-flex cursor-pointer items-center outline-none focus-visible:z-10 focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-60",
        "gap-2.5 rounded-full",
        className
      ),
      onClick: () => setActiveStep(step),
      onKeyDown: handleKeyDown,
      disabled: isDisabled,
      ...props,
      children
    }
  );
}
function StepperIndicator({
  children,
  className
}) {
  const { state, isLoading } = useStepItem();
  const { indicators } = useStepper();
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "stepper-indicator",
      "data-state": state,
      className: cn(
        "border-background bg-accent text-accent-foreground data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative flex size-6 shrink-0 items-center justify-center overflow-hidden",
        "rounded-full text-xs",
        className
      ),
      children: /* @__PURE__ */ jsx("div", { className: "absolute", children: indicators && (isLoading && indicators.loading || state === "completed" && indicators.completed || state === "active" && indicators.active || state === "inactive" && indicators.inactive) ? isLoading && indicators.loading || state === "completed" && indicators.completed || state === "active" && indicators.active || state === "inactive" && indicators.inactive : children })
    }
  );
}
function StepperSeparator({ className }) {
  const { state } = useStepItem();
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "stepper-separator",
      "data-state": state,
      className: cn(
        "bg-muted rounded-sm group-data-[orientation=horizontal]/stepper-nav:h-0.5 group-data-[orientation=vertical]/stepper-nav:h-12 group-data-[orientation=vertical]/stepper-nav:w-0.5 m-0.5 group-data-[orientation=horizontal]/stepper-nav:flex-1",
        className
      )
    }
  );
}
function StepperTitle({ children, className }) {
  const { state } = useStepItem();
  return /* @__PURE__ */ jsx(
    "h3",
    {
      "data-slot": "stepper-title",
      "data-state": state,
      className: cn(
        "text-sm leading-none font-medium",
        className
      ),
      children
    }
  );
}
function StepperNav({ children, className }) {
  const { activeStep, orientation } = useStepper();
  return /* @__PURE__ */ jsx(
    "nav",
    {
      "data-slot": "stepper-nav",
      "data-state": activeStep,
      "data-orientation": orientation,
      className: cn(
        "group/stepper-nav inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
        className
      ),
      children
    }
  );
}

function StepIndicatorBar({ currentStep, steps }) {
  return /* @__PURE__ */ jsx(
    Stepper,
    {
      value: currentStep + 1,
      indicators: {
        completed: /* @__PURE__ */ jsx(Check, { className: "size-3.5" }),
        loading: /* @__PURE__ */ jsx(LoaderCircle, { className: "size-3.5 animate-spin" })
      },
      children: /* @__PURE__ */ jsx(StepperNav, { children: steps.map((step, index) => /* @__PURE__ */ jsxs(StepperItem, { step: index + 1, children: [
        /* @__PURE__ */ jsx(StepperTrigger, { asChild: true, children: /* @__PURE__ */ jsx(StepperIndicator, {}) }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsx(StepperTitle, { children: step.label }) }),
        index < steps.length - 1 && /* @__PURE__ */ jsx(StepperSeparator, {})
      ] }, step.label)) })
    }
  );
}

function useMultiStep(totalSteps, options) {
  const [currentStep, setCurrentStep] = useState(0);
  const next = useCallback(async () => {
    if (options?.onBeforeNext) {
      const canProceed = await options.onBeforeNext();
      if (!canProceed) return false;
    }
    setCurrentStep((prev2) => Math.min(prev2 + 1, totalSteps - 1));
    return true;
  }, [totalSteps, options]);
  const prev = useCallback(
    () => setCurrentStep((prev2) => Math.max(prev2 - 1, 0)),
    []
  );
  const goTo = useCallback(
    (step) => {
      if (step >= 0 && step < totalSteps) setCurrentStep(step);
    },
    [totalSteps]
  );
  return {
    currentStep,
    totalSteps,
    next,
    prev,
    goTo,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1
  };
}

function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialog$1.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialog$1.Portal, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialog$1.Overlay,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsx(
      AlertDialog$1.Content,
      {
        "data-slot": "alert-dialog-content",
        "data-size": size,
        className: cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      ),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialog$1.Title,
    {
      "data-slot": "alert-dialog-title",
      className: cn(
        "font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      ),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialog$1.Description,
    {
      "data-slot": "alert-dialog-description",
      className: cn(
        "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      ),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(Button, { variant, size, asChild: true, children: /* @__PURE__ */ jsx(
    AlertDialog$1.Action,
    {
      "data-slot": "alert-dialog-action",
      className: cn(className),
      ...props
    }
  ) });
}
function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(Button, { variant, size, asChild: true, children: /* @__PURE__ */ jsx(
    AlertDialog$1.Cancel,
    {
      "data-slot": "alert-dialog-cancel",
      className: cn(className),
      ...props
    }
  ) });
}

function UnsavedChangesGuard({ isDirty }) {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState(null);
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
  useEffect(() => {
    if (!isDirty) return;
    const handleClick = (e) => {
      const anchor = e.target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:"))
        return;
      e.preventDefault();
      e.stopPropagation();
      setPendingUrl(href);
      setShowDialog(true);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);
  const handleConfirmLeave = () => {
    setShowDialog(false);
    if (pendingUrl) {
      window.location.href = pendingUrl;
    }
  };
  const handleCancel = () => {
    setShowDialog(false);
    setPendingUrl(null);
  };
  return /* @__PURE__ */ jsx(AlertDialog, { open: showDialog, onOpenChange: setShowDialog, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
    /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Salir sin guardar?" }),
      /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Tienes cambios sin guardar en el formulario. Si sales ahora, perderás toda la información ingresada." })
    ] }),
    /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: handleCancel, children: "Seguir editando" }),
      /* @__PURE__ */ jsx(AlertDialogAction, { variant: "destructive", onClick: handleConfirmLeave, children: "Salir sin guardar" })
    ] })
  ] }) });
}

function FormStep({ title, description, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "border-b border-slate-100 pb-2 text-xs font-black tracking-widest text-slate-400 uppercase", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-500", children: description })
    ] }),
    children
  ] });
}

const TIPOS_DOCUMENTO = [
  "Registro Civil",
  "Tarjeta de Identidad",
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "Pasaporte"
];
const GRUPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GRUPOS_ETNICOS = [
  "No pertenece a ninguno",
  "Indígena",
  "Afrocolombiano",
  "Raizal",
  "Palenquero",
  "Rrom (Gitano)"
];
const NIVELES_EDUCATIVOS = [
  "Primaria Incompleta",
  "Primaria Completa",
  "Secundaria Incompleta",
  "Secundaria Completa (Bachiller)",
  "Técnico",
  "Tecnólogo",
  "Pregrado (Universitario)",
  "Postgrado / Especialización",
  "Maestría",
  "Doctorado"
];
const EPS_COLOMBIA = [
  "Aliansalud",
  "Asmet Salud",
  "Cajacopi EPS",
  "Capital Salud",
  "Capresoca",
  "Comfenalco Valle",
  "Compensar EPS",
  "Coosalud",
  "Emssanar EPS",
  "EPS Sanitas",
  "EPS Sura",
  "EPS Famisanar",
  "EPS Servicio Occidental de Salud (SOS)",
  "Mutual Ser",
  "Nueva EPS",
  "Salud Total EPS",
  "Savia Salud EPS",
  "Sanidad Policía Nacional",
  "Sanidad Militar",
  "Otra"
];
const LIGAS = [
  "LIVALPARAATLETISMO - Visuales, PC, Físicos y Guías",
  "LIVADISMEN - Intelectual",
  "LIVADESOR - Sordos"
];
const PAISES = ["Colombia", "Venezuela", "Ecuador", "Perú", "Brasil", "Argentina", "Chile", "México", "Estados Unidos", "España", "Otro"];
const DEPARTAMENTOS_COLOMBIA = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
  "Bogotá D.C."
];
const MUNICIPIOS_VALLE = [
  "Cali",
  "Buenaventura",
  "Palmira",
  "Tuluá",
  "Yumbo",
  "Cartago",
  "Jamundí",
  "Buga",
  "Dagua",
  "Zarzal",
  "Roldanillo",
  "Sevilla",
  "Florida",
  "Pradera",
  "El Cerrito",
  "Candelaria"
];
const CLUBS = [
  "Club Deportivo Imparables a la Meta",
  "Club Deportivo Minas del Paraatletismo",
  "Club Deportivo Discatle",
  "Club Deportivo de Paraatletismo PC Yumbo",
  "Club Deportivo Casin"
];
const MODALIDADES = ["Pista", "Campo", "Pista y Campo"];
const CLASES_PISTA = [
  "T11",
  "T12",
  "T13",
  "T20",
  "T31",
  "T32",
  "T33",
  "T34",
  "T35",
  "T36",
  "T37",
  "T38",
  "T40",
  "T41",
  "T42",
  "T43",
  "T44",
  "T45",
  "T46",
  "T47",
  "T51",
  "T52",
  "T53",
  "T54",
  "T61",
  "T62",
  "T63",
  "T64",
  "T71",
  "T72"
];
const CLASES_CAMPO = [
  "F11",
  "F12",
  "F13",
  "F20",
  "F31",
  "F32",
  "F33",
  "F34",
  "F35",
  "F36",
  "F37",
  "F38",
  "F40",
  "F41",
  "F42",
  "F43",
  "F44",
  "F45",
  "F46",
  "F51",
  "F52",
  "F53",
  "F54",
  "F55",
  "F56",
  "F57",
  "F61",
  "F62",
  "F63",
  "F64"
];
const PRUEBAS_PISTA = [
  "100m",
  "200m",
  "400m",
  "800m",
  "1500m",
  "5000m",
  "10000m",
  "Relevos"
];
const PRUEBAS_CAMPO = [
  "Lanzamiento de Bala",
  "Lanzamiento de Jabalina",
  "Lanzamiento de Disco",
  "Lanzamiento de Clava",
  "Salto de Longitud",
  "Salto de Altura"
];
const TALLAS_US = Array.from({ length: 31 }, (_, i) => 5 + i * 0.5).map((s) => String(s));
const TALLAS_ROPA = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const BASIC_DATA_FIELDS = [
  "nombre",
  "tipoDocumento",
  "cedula",
  "genero",
  "grupoSanguineo",
  "fechaNacimiento",
  "paisNacimiento",
  "departamentoNacimiento",
  "municipioNacimiento",
  "grupoEtnico",
  "nivelEducativo",
  "eps",
  "altura",
  "peso"
];
const BasicDataStep = ({ register, control, errors, isLoading }) => {
  const watchPaisNacimiento = useWatch({ control, name: "paisNacimiento" });
  const watchDepartamentoNacimiento = useWatch({ control, name: "departamentoNacimiento" });
  return /* @__PURE__ */ jsx(FormStep, { title: "Datos Básicos", icon: "person", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Nombres y Apellidos" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          ...register("nombre"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10",
          placeholder: "Ej: Juan Pérez"
        }
      ),
      errors.nombre && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.nombre.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Tipo Doc." }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("tipoDocumento"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            TIPOS_DOCUMENTO.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
          ]
        }
      ),
      errors.tipoDocumento && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.tipoDocumento.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Número Documento" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          ...register("cedula"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
        }
      ),
      errors.cedula && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.cedula.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Género" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("genero"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            /* @__PURE__ */ jsx("option", { value: "Masculino", children: "Masculino" }),
            /* @__PURE__ */ jsx("option", { value: "Femenino", children: "Femenino" })
          ]
        }
      ),
      errors.genero && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.genero.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Grupo Sanguíneo" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("grupoSanguineo"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "RH..." }),
            GRUPOS_SANGUINEOS.map((g) => /* @__PURE__ */ jsx("option", { value: g, children: g }, g))
          ]
        }
      ),
      errors.grupoSanguineo && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.grupoSanguineo.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Fecha de Nacimiento" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "date",
          ...register("fechaNacimiento"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
        }
      ),
      errors.fechaNacimiento && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.fechaNacimiento.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "País de Nacimiento" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("paisNacimiento"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            PAISES.map((p) => /* @__PURE__ */ jsx("option", { value: p, children: p }, p))
          ]
        }
      ),
      errors.paisNacimiento && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.paisNacimiento.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Depto. de Nacimiento" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("departamentoNacimiento"),
          disabled: isLoading || !watchPaisNacimiento,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            watchPaisNacimiento === "Colombia" ? DEPARTAMENTOS_COLOMBIA.map((d) => /* @__PURE__ */ jsx("option", { value: d, children: d }, d)) : /* @__PURE__ */ jsx("option", { value: "N/A", children: "No Aplica / Extranjero" })
          ]
        }
      ),
      errors.departamentoNacimiento && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.departamentoNacimiento.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Municipio Nacimiento" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("municipioNacimiento"),
          disabled: isLoading || !watchDepartamentoNacimiento,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            watchDepartamentoNacimiento === "Valle del Cauca" ? MUNICIPIOS_VALLE.map((m) => /* @__PURE__ */ jsx("option", { value: m, children: m }, m)) : /* @__PURE__ */ jsx("option", { value: "Capital/Principal", children: "Capital/Principal (Genérico)" })
          ]
        }
      ),
      errors.municipioNacimiento && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.municipioNacimiento.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Grupo Étnico" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("grupoEtnico"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            GRUPOS_ETNICOS.map((e) => /* @__PURE__ */ jsx("option", { value: e, children: e }, e))
          ]
        }
      ),
      errors.grupoEtnico && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.grupoEtnico.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Nivel Educativo" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("nivelEducativo"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            NIVELES_EDUCATIVOS.map((e) => /* @__PURE__ */ jsx("option", { value: e, children: e }, e))
          ]
        }
      ),
      errors.nivelEducativo && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.nivelEducativo.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "EPS / Salud" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("eps"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            EPS_COLOMBIA.map((e) => /* @__PURE__ */ jsx("option", { value: e, children: e }, e))
          ]
        }
      ),
      errors.eps && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.eps.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Altura (cm)" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("altura"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "..." }),
            Array.from({ length: 131 }, (_, i) => 100 + i).map((cm) => /* @__PURE__ */ jsxs("option", { value: `${cm} cm`, children: [
              cm,
              " cm"
            ] }, cm))
          ]
        }
      ),
      errors.altura && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.altura.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Peso (kg)" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("peso"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "..." }),
            Array.from({ length: 171 }, (_, i) => 30 + i).map((kg) => /* @__PURE__ */ jsxs("option", { value: `${kg} kg`, children: [
              kg,
              " kg"
            ] }, kg))
          ]
        }
      ),
      errors.peso && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.peso.message })
    ] })
  ] }) });
};

const CONTACT_INFO_FIELDS = [
  "correo",
  "paisResidencia",
  "departamentoResidencia",
  "municipioResidencia",
  "barrio",
  "direccion",
  "estrato",
  "telefonoFijo",
  "telefono",
  "discapacidad",
  "usaSillaRuedas",
  "usaSillaAtletica"
];
const ContactInfoStep = ({ register, control, setValue, errors, isLoading }) => {
  const watchPaisResidencia = useWatch({ control, name: "paisResidencia" });
  const watchDepartamentoResidencia = useWatch({ control, name: "departamentoResidencia" });
  const watchEstrato = useWatch({ control, name: "estrato" });
  return /* @__PURE__ */ jsx(FormStep, { title: "Información de Contacto", icon: "contact_phone", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Correo Electrónico" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          ...register("correo"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10",
          placeholder: "ejemplo@correo.com"
        }
      ),
      errors.correo && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.correo.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-700 uppercase", children: [
          "Celular ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "tel",
            ...register("telefono"),
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          }
        ),
        errors.telefono && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.telefono.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Teléfono Fijo" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "tel",
            ...register("telefonoFijo"),
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
            placeholder: "Opcional"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "País de Residencia" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("paisResidencia"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            PAISES.map((p) => /* @__PURE__ */ jsx("option", { value: p, children: p }, p))
          ]
        }
      ),
      errors.paisResidencia && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.paisResidencia.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Depto. de Residencia" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("departamentoResidencia"),
          disabled: isLoading || !watchPaisResidencia,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            watchPaisResidencia === "Colombia" ? DEPARTAMENTOS_COLOMBIA.map((d) => /* @__PURE__ */ jsx("option", { value: d, children: d }, d)) : /* @__PURE__ */ jsx("option", { value: "N/A", children: "No Aplica / Extranjero" })
          ]
        }
      ),
      errors.departamentoResidencia && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.departamentoResidencia.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Municipio Residencia" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("municipioResidencia"),
          disabled: isLoading || !watchDepartamentoResidencia,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            watchDepartamentoResidencia === "Valle del Cauca" ? MUNICIPIOS_VALLE.map((m) => /* @__PURE__ */ jsx("option", { value: m, children: m }, m)) : /* @__PURE__ */ jsx("option", { value: "Capital/Principal", children: "Capital/Principal (Genérico)" })
          ]
        }
      ),
      errors.municipioResidencia && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.municipioResidencia.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Barrio" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          ...register("barrio"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
        }
      ),
      errors.barrio && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.barrio.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Dirección de Residencia" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          ...register("direccion"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          placeholder: "Ej: Calle 123 # 45 - 67"
        }
      ),
      errors.direccion && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.direccion.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Estrato Socioeconómico" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: [1, 2, 3, 4, 5, 6].map((num) => {
        const isSelected = watchEstrato === num.toString();
        return /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setValue("estrato", num.toString(), { shouldValidate: true }),
            className: `flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${isSelected ? "border-red-500 bg-red-500 text-white shadow-md scale-110" : "border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50"}`,
            children: /* @__PURE__ */ jsx("span", { className: "font-bold", children: num })
          },
          num
        );
      }) }),
      errors.estrato && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.estrato.message })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-slate-800 mb-4", children: "Condición / Discapacidad" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Discapacidad" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("discapacidad"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
            Object.entries(DISCAPACIDADES).map(([key, value]) => /* @__PURE__ */ jsx("option", { value: key, children: value.nombre.replace("Discapacidad ", "") }, key)),
            /* @__PURE__ */ jsx("option", { value: "Guia", children: "Guía (Atleta de apoyo)" }),
            /* @__PURE__ */ jsx("option", { value: "Auxiliar", children: "Auxiliar / Otro" })
          ]
        }
      ),
      errors.discapacidad && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.discapacidad.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase leading-tight", children: "Usuario Silla de Ruedas?" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            ...register("usaSillaRuedas"),
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "..." }),
              /* @__PURE__ */ jsx("option", { value: "Sí", children: "Sí" }),
              /* @__PURE__ */ jsx("option", { value: "No", children: "No" })
            ]
          }
        ),
        errors.usaSillaRuedas && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.usaSillaRuedas.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase leading-tight", children: "Silla Atlética / Banco?" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            ...register("usaSillaAtletica"),
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "..." }),
              /* @__PURE__ */ jsx("option", { value: "Sí", children: "Sí" }),
              /* @__PURE__ */ jsx("option", { value: "No", children: "No" })
            ]
          }
        ),
        errors.usaSillaAtletica && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.usaSillaAtletica.message })
      ] })
    ] })
  ] }) });
};

const SPORT_INFO_FIELDS = [
  "club",
  "fechaAfiliacion",
  "liga",
  "certificadoAfiliacion",
  "modalidad",
  "claseDeportiva",
  "pruebasPista",
  "pruebasCampo",
  "tallaSpikeVelocidad",
  "tallaSpikeSemifondo",
  "tallaSpikeFondo",
  "tallaSpikeBala",
  "tallaSpikeJabalina",
  "tallaTenisPresentacion",
  "tallaChaqueta",
  "tallaPantalon",
  "tallaCamibuso",
  "tallaCamisilla",
  "tallaLicraMedia",
  "tallaLicraLarga",
  "password",
  "especialidad"
];
const SportInfoStep = ({ register, control, setValue, errors, isLoading, isEditing, isCoach = false }) => {
  const [fileName, setFileName] = useState(null);
  const watchCertificado = useWatch({ control, name: "certificadoAfiliacion" });
  const watchModalidad = useWatch({ control, name: "modalidad" });
  const watchedPruebasPista = useWatch({ control, name: "pruebasPista" }) || [];
  const watchedPruebasCampo = useWatch({ control, name: "pruebasCampo" }) || [];
  const isPista = watchModalidad === "Pista" || watchModalidad === "Pista y Campo";
  const isCampo = watchModalidad === "Campo" || watchModalidad === "Pista y Campo";
  const needsSpikeVelocidad = watchedPruebasPista.some((p) => ["100m", "200m", "400m", "Relevos"].includes(p));
  const needsSpikeSemifondo = watchedPruebasPista.some((p) => ["800m", "1500m"].includes(p));
  const needsSpikeFondo = watchedPruebasPista.some((p) => ["5000m", "10000m"].includes(p));
  const needsSpikeBala = watchedPruebasCampo.includes("Lanzamiento de Bala");
  const needsSpikeJabalina = watchedPruebasCampo.includes("Lanzamiento de Jabalina");
  const needsSpikeDisco = watchedPruebasCampo.includes("Lanzamiento de Disco");
  const needsSpikeClava = watchedPruebasCampo.includes("Lanzamiento de Clava");
  const needsSpikeSaltoLongitud = watchedPruebasCampo.includes("Salto de Longitud");
  const needsSpikeSaltoAltura = watchedPruebasCampo.includes("Salto de Altura");
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("El certificado debe ser un archivo PDF.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no debe superar los 5MB.");
        return;
      }
      setFileName(file.name);
      setValue("certificadoAfiliacion", file, { shouldValidate: true });
    }
  };
  return /* @__PURE__ */ jsx(FormStep, { title: "Información Deportiva", icon: "sports", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Club al que está afiliado" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("club"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un club..." }),
            CLUBS.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c))
          ]
        }
      ),
      errors.club && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.club.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Fecha de Afiliación" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "date",
          ...register("fechaAfiliacion"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
        }
      ),
      errors.fechaAfiliacion && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.fechaAfiliacion.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Liga" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("liga"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar liga..." }),
            LIGAS.map((l) => /* @__PURE__ */ jsx("option", { value: l, children: l }, l))
          ]
        }
      ),
      errors.liga && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.liga.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Certificado de Afiliación al Club (PDF)" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: fileName || typeof watchCertificado === "string" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-bold text-slate-700", children: [
          /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-500", children: "picture_as_pdf" }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: fileName || "Certificado_Subido.pdf" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-500", children: "Sube el documento oficial en formato PDF (Max 5MB)" }) }),
        /* @__PURE__ */ jsxs("div", { className: "shrink-0", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              id: "certificado-upload",
              accept: "application/pdf",
              className: "hidden",
              onChange: handleFileChange,
              disabled: isLoading
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => document.getElementById("certificado-upload")?.click(),
              disabled: isLoading,
              children: [
                /* @__PURE__ */ jsx("span", { className: "material-icons-round mr-2 text-sm", children: "upload_file" }),
                fileName || watchCertificado ? "Cambiar Archivo" : "Subir PDF"
              ]
            }
          )
        ] })
      ] }),
      errors.certificadoAfiliacion && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.certificadoAfiliacion.message })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-slate-800 mb-4", children: "Módulo de Pruebas y Clases" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Modalidad" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("modalidad"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          onChange: (e) => {
            register("modalidad").onChange(e);
            setValue("claseDeportiva", "");
          },
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione Modalidad..." }),
            MODALIDADES.map((m) => /* @__PURE__ */ jsx("option", { value: m, children: m }, m))
          ]
        }
      ),
      errors.modalidad && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.modalidad.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Clase Deportiva" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("claseDeportiva"),
          disabled: isLoading || !watchModalidad,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione Clase..." }),
            isPista && !isCampo && CLASES_PISTA.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c)),
            isCampo && !isPista && CLASES_CAMPO.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c)),
            watchModalidad === "Pista y Campo" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("optgroup", { label: "Clases de Pista", children: CLASES_PISTA.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c)) }),
              /* @__PURE__ */ jsx("optgroup", { label: "Clases de Campo", children: CLASES_CAMPO.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c)) })
            ] })
          ]
        }
      ),
      errors.claseDeportiva && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.claseDeportiva.message })
    ] }),
    isPista && /* @__PURE__ */ jsxs("div", { className: "space-y-3 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase block mb-2", children: "Pruebas de Pista (Seleccione Participación)" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-2", children: PRUEBAS_PISTA.map((prueba) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700 text-center", children: prueba }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "w-full text-xs rounded-md border border-slate-200 py-1.5 px-2 bg-slate-50 focus:outline-none focus:border-red-500 font-medium text-slate-700",
            value: watchedPruebasPista.includes(prueba) ? prueba : "",
            disabled: isLoading,
            onChange: (e) => {
              const isSelected = e.target.value === prueba;
              if (isSelected) {
                setValue("pruebasPista", [...watchedPruebasPista, prueba], { shouldValidate: true });
              } else {
                setValue("pruebasPista", watchedPruebasPista.filter((p) => p !== prueba), { shouldValidate: true });
              }
            },
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "✗ No" }),
              /* @__PURE__ */ jsx("option", { value: prueba, children: "✓ Sí" })
            ]
          }
        )
      ] }, prueba)) }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 italic mt-2", children: "Nota: Al marcar una con ✓ (Sí), el sistema asume que no participa en las demás (X)." })
    ] }),
    isCampo && /* @__PURE__ */ jsxs("div", { className: "space-y-3 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase block mb-2", children: "Pruebas de Campo (Seleccione Participación)" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-2", children: PRUEBAS_CAMPO.map((prueba) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700 text-center", children: prueba }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "w-full text-xs rounded-md border border-slate-200 py-1.5 px-2 bg-slate-50 focus:outline-none focus:border-red-500 font-medium text-slate-700",
            value: watchedPruebasCampo.includes(prueba) ? prueba : "",
            disabled: isLoading,
            onChange: (e) => {
              const isSelected = e.target.value === prueba;
              if (isSelected) {
                setValue("pruebasCampo", [...watchedPruebasCampo, prueba], { shouldValidate: true });
              } else {
                setValue("pruebasCampo", watchedPruebasCampo.filter((p) => p !== prueba), { shouldValidate: true });
              }
            },
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "✗ No" }),
              /* @__PURE__ */ jsx("option", { value: prueba, children: "✓ Sí" })
            ]
          }
        )
      ] }, prueba)) }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 italic mt-2", children: "Nota: Al marcar una con ✓ (Sí), el sistema asume que no participa en las demás (X)." })
    ] }),
    !isCoach && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-slate-800 mb-4", children: "Talla Calzado (Competencia y Presentación) - Escala US" }) }),
      needsSpikeVelocidad && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Spike Velocidad" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaSpikeVelocidad"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_US.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
            t,
            " US"
          ] }, t))
        ] })
      ] }),
      needsSpikeSemifondo && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Spike Semifondo" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaSpikeSemifondo"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_US.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
            t,
            " US"
          ] }, t))
        ] })
      ] }),
      needsSpikeFondo && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Spike Fondo" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaSpikeFondo"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_US.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
            t,
            " US"
          ] }, t))
        ] })
      ] }),
      needsSpikeBala && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Spike Lanzamiento de Bala" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaSpikeBala"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_US.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
            t,
            " US"
          ] }, t))
        ] })
      ] }),
      needsSpikeJabalina && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Spike Jabalina" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaSpikeJabalina"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_US.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
            t,
            " US"
          ] }, t))
        ] })
      ] }),
      needsSpikeDisco && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Spike Lanzamiento de Disco" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaSpikeDisco"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_US.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
            t,
            " US"
          ] }, t))
        ] })
      ] }),
      needsSpikeClava && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Spike Lanzamiento de Clava" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaSpikeClava"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_US.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
            t,
            " US"
          ] }, t))
        ] })
      ] }),
      needsSpikeSaltoLongitud && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Spike Salto de Longitud" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaSpikeSaltoLongitud"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_US.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
            t,
            " US"
          ] }, t))
        ] })
      ] }),
      needsSpikeSaltoAltura && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Spike Salto de Altura" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaSpikeSaltoAltura"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_US.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
            t,
            " US"
          ] }, t))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Tenis de Presentación" }),
      /* @__PURE__ */ jsxs("select", { ...register("tallaTenisPresentacion"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
        TALLAS_US.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
          t,
          " US"
        ] }, t))
      ] }),
      errors.tallaTenisPresentacion && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.tallaTenisPresentacion.message })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-slate-800 mb-4", children: "Talla Uniformes (Competencia y Presentación)" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Chaqueta" }),
      /* @__PURE__ */ jsxs("select", { ...register("tallaChaqueta"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
        TALLAS_ROPA.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
      ] }),
      errors.tallaChaqueta && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.tallaChaqueta.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Pantalón" }),
      /* @__PURE__ */ jsxs("select", { ...register("tallaPantalon"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
        TALLAS_ROPA.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
      ] }),
      errors.tallaPantalon && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.tallaPantalon.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Camibuso" }),
      /* @__PURE__ */ jsxs("select", { ...register("tallaCamibuso"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
        TALLAS_ROPA.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
      ] }),
      errors.tallaCamibuso && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.tallaCamibuso.message })
    ] }),
    !isCoach && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Talla Camisilla Competencia" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaCamisilla"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_ROPA.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
        ] }),
        errors.tallaCamisilla && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.tallaCamisilla.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Pant. Licrado Media Caña" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaLicraMedia"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_ROPA.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
        ] }),
        errors.tallaLicraMedia && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.tallaLicraMedia.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Pant. Licrado Largo" }),
        /* @__PURE__ */ jsxs("select", { ...register("tallaLicraLarga"), disabled: isLoading, className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione talla..." }),
          TALLAS_ROPA.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
        ] }),
        errors.tallaLicraLarga && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.tallaLicraLarga.message })
      ] })
    ] }),
    isCoach && /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Especialidad" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ...register("especialidad"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal",
          placeholder: "Ej. Lanzamientos, Velocidad..."
        }
      ),
      errors.especialidad && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.especialidad.message })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-slate-800 mb-4", children: "Seguridad de la Cuenta" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: isEditing ? "Nueva Contraseña (Opcional)" : "Contraseña de Acceso" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          ...register("password"),
          disabled: isLoading,
          className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10",
          placeholder: "Mínimo 6 caracteres"
        }
      ),
      errors.password && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.password.message })
    ] })
  ] }) });
};

const GUARDIAN_INFO_FIELDS = [
  "nombreAcudiente",
  "correoAcudiente",
  "departamentoAcudiente",
  "municipioAcudiente",
  "barrioAcudiente",
  "direccionAcudiente",
  "telefonoAcudiente"
];
const GuardianInfoStep = ({
  register,
  errors,
  isLoading
}) => {
  return /* @__PURE__ */ jsx(FormStep, { title: "Información Acudiente", icon: "family_restroom", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Nombre y Apellido del Acudiente" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("span", { className: "material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400", children: "person" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...register("nombreAcudiente"),
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal",
            placeholder: "Nombre completo"
          }
        )
      ] }),
      errors.nombreAcudiente && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.nombreAcudiente.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Correo Electrónico" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("span", { className: "material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400", children: "email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...register("correoAcudiente"),
            type: "email",
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal",
            placeholder: "correo@ejemplo.com"
          }
        )
      ] }),
      errors.correoAcudiente && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.correoAcudiente.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Número de Celular" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("span", { className: "material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400", children: "phone_iphone" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...register("telefonoAcudiente"),
            type: "tel",
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal",
            placeholder: "300 000 0000"
          }
        )
      ] }),
      errors.telefonoAcudiente && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.telefonoAcudiente.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Departamento" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("span", { className: "material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400", children: "map" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...register("departamentoAcudiente"),
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal",
            placeholder: "Ej. Valle del Cauca"
          }
        )
      ] }),
      errors.departamentoAcudiente && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.departamentoAcudiente.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Municipio" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("span", { className: "material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400", children: "location_city" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...register("municipioAcudiente"),
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal",
            placeholder: "Ej. Cali"
          }
        )
      ] }),
      errors.municipioAcudiente && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.municipioAcudiente.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Barrio" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("span", { className: "material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400", children: "holiday_village" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...register("barrioAcudiente"),
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal",
            placeholder: "Ej. San Fernando"
          }
        )
      ] }),
      errors.barrioAcudiente && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.barrioAcudiente.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 uppercase", children: "Dirección" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("span", { className: "material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400", children: "home" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...register("direccionAcudiente"),
            disabled: isLoading,
            className: "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal",
            placeholder: "Ej. Cra 34 # 5-12"
          }
        )
      ] }),
      errors.direccionAcudiente && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.direccionAcudiente.message })
    ] })
  ] }) });
};

const STEPS$1 = [
  { label: "Datos Básicos", fields: BASIC_DATA_FIELDS },
  { label: "Contacto", fields: CONTACT_INFO_FIELDS },
  { label: "Acudiente", fields: GUARDIAN_INFO_FIELDS },
  { label: "Deportiva", fields: SPORT_INFO_FIELDS }
];
const AthleteForm = ({
  initialData,
  onSuccess,
  onCancel
}) => {
  const isEditing = !!initialData;
  const [photoBase64, setPhotoBase64] = useState(void 0);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    trigger,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(
      isEditing ? editAthleteSchema : registerAthleteSchema
    ),
    defaultValues: {
      nombre: "",
      tipoDocumento: "",
      cedula: "",
      genero: "Masculino",
      grupoSanguineo: "",
      fechaNacimiento: "",
      paisNacimiento: "",
      departamentoNacimiento: "",
      municipioNacimiento: "",
      grupoEtnico: "",
      nivelEducativo: "",
      eps: "",
      altura: "",
      peso: "",
      correo: "",
      paisResidencia: "",
      departamentoResidencia: "",
      municipioResidencia: "",
      barrio: "",
      direccion: "",
      estrato: "",
      telefonoFijo: "",
      telefono: "",
      discapacidad: "",
      usaSillaRuedas: "",
      usaSillaAtletica: "",
      club: "",
      fechaAfiliacion: "",
      liga: "",
      password: "",
      foto: "",
      tipoClase: "",
      claseDeportiva: ""
    },
    mode: "onTouched"
  });
  const formValues = useWatch({ control });
  const validateCurrentStep = async () => {
    const fields = STEPS$1[stepper.currentStep]?.fields;
    if (!fields) return true;
    return trigger(fields);
  };
  const stepper = useMultiStep(STEPS$1.length, {
    onBeforeNext: validateCurrentStep
  });
  const watchDiscapacidad = formValues.discapacidad;
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        nombre: initialData.nombre || "",
        tipoDocumento: initialData.tipoDocumento || "",
        cedula: initialData.cedula || "",
        genero: initialData.genero || "Masculino",
        grupoSanguineo: initialData.grupoSanguineo || "",
        fechaNacimiento: initialData.fechaNacimiento || "",
        paisNacimiento: initialData.paisNacimiento || "",
        departamentoNacimiento: initialData.departamentoNacimiento || "",
        municipioNacimiento: initialData.municipioNacimiento || "",
        grupoEtnico: initialData.grupoEtnico || "",
        nivelEducativo: initialData.nivelEducativo || "",
        eps: initialData.eps || "",
        altura: initialData.altura || "",
        peso: initialData.peso || "",
        correo: initialData.correo || "",
        paisResidencia: initialData.paisResidencia || "",
        departamentoResidencia: initialData.departamentoResidencia || "",
        municipioResidencia: initialData.municipioResidencia || "",
        barrio: initialData.barrio || "",
        direccion: initialData.direccion || "",
        estrato: initialData.estrato || "",
        telefonoFijo: initialData.telefonoFijo || "",
        telefono: initialData.telefono || "",
        discapacidad: initialData.discapacidad || "",
        usaSillaRuedas: initialData.usaSillaRuedas || "",
        usaSillaAtletica: initialData.usaSillaAtletica || "",
        club: initialData.club || "",
        fechaAfiliacion: initialData.fechaAfiliacion || "",
        liga: initialData.liga || "",
        password: "",
        foto: initialData.foto || "",
        tipoClase: initialData.tipoClase || "",
        claseDeportiva: initialData.claseDeportiva || ""
      });
      setPhotoBase64(initialData.foto || void 0);
    }
    setGeneralError(null);
  }, [initialData, reset]);
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor, suba únicamente imágenes (.jpg, .png, .jpeg)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setPhotoBase64(base64);
      setValue("foto", base64);
    };
    reader.readAsDataURL(file);
  };
  const handleRemovePhoto = () => {
    setPhotoBase64(void 0);
    setValue("foto", "");
  };
  const onSubmit = async (data) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      const payload = { ...data };
      if (isEditing && initialData?.id) payload.id = initialData.id;
      if (isEditing && !payload.password) delete payload.password;
      const saved = await saveAthlete(payload);
      if (onSuccess) onSuccess({ ...saved, ...data });
    } catch (error) {
      setGeneralError(
        error.message || "Ocurrió un error al guardar los datos del atleta."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(UnsavedChangesGuard, { isDirty: isDirty && !isLoading }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", noValidate: true, children: [
      generalError && /* @__PURE__ */ jsx("div", { className: "animate-fade-in rounded-2xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed font-semibold text-red-600", children: generalError }),
      /* @__PURE__ */ jsx(StepIndicatorBar, { currentStep: stepper.currentStep, steps: STEPS$1 }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-start gap-8 lg:grid-cols-12", children: [
        /* @__PURE__ */ jsxs("div", { className: `space-y-8 lg:col-span-4 ${stepper.currentStep === 0 ? "" : "hidden"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-6", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-4 block self-start text-xs font-bold tracking-wider text-slate-700 uppercase", children: "Foto de Perfil" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => document.getElementById("athlete-modal-avatar-upload")?.click(),
                className: "group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-white transition-colors duration-200 hover:border-red-500",
                children: photoBase64 ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: photoBase64,
                    alt: "Avatar",
                    className: "h-full w-full object-cover"
                  }
                ) : /* @__PURE__ */ jsxs("div", { className: "p-4 text-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "material-icons-round text-3xl text-slate-400 transition-colors group-hover:text-red-500", children: "add_a_photo" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-[10px] font-bold tracking-wide text-slate-400 uppercase", children: "Subir Foto" })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "athlete-modal-avatar-upload",
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handlePhotoChange,
                disabled: isLoading
              }
            ),
            photoBase64 && /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: handleRemovePhoto,
                disabled: isLoading,
                className: "mt-4 text-xs font-bold text-red-600 hover:text-red-700",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "material-icons-round text-sm", children: "delete" }),
                  "Eliminar Foto"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-100 bg-slate-50 p-6", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-4 block text-xs font-bold tracking-wider text-slate-700 uppercase", children: "Vista Previa" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-red-500/20 bg-slate-100", children: photoBase64 ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: photoBase64,
                  className: "h-full w-full object-cover",
                  alt: "Card Preview"
                }
              ) : /* @__PURE__ */ jsx("span", { className: "material-icons-round text-3xl text-slate-300", children: "person" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "truncate text-sm font-bold text-slate-900", children: formValues.nombre || "Nombre del Atleta" }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase", children: formValues.club || "Atleta Valle Oro Puro" }),
                /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: watchDiscapacidad && /* @__PURE__ */ jsx("span", { className: "rounded-md border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 capitalize", children: DISCAPACIDADES[watchDiscapacidad]?.nombre.replace("Discapacidad ", "") || watchDiscapacidad }) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `space-y-6 ${stepper.currentStep === 0 ? "lg:col-span-8" : "lg:col-span-12"}`, children: [
          /* @__PURE__ */ jsx("div", { className: stepper.currentStep === 0 ? "" : "hidden", children: /* @__PURE__ */ jsx(
            BasicDataStep,
            {
              register,
              control,
              errors,
              isLoading
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: stepper.currentStep === 1 ? "" : "hidden", children: /* @__PURE__ */ jsx(
            ContactInfoStep,
            {
              register,
              control,
              setValue,
              errors,
              isLoading
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: stepper.currentStep === 2 ? "" : "hidden", children: /* @__PURE__ */ jsx(
            GuardianInfoStep,
            {
              register,
              control,
              errors,
              isLoading
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: stepper.currentStep === 3 ? "" : "hidden", children: /* @__PURE__ */ jsx(
            SportInfoStep,
            {
              register,
              control,
              setValue,
              errors,
              isLoading,
              isEditing
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              !stepper.isFirst && /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: stepper.prev,
                  disabled: isLoading,
                  children: [
                    /* @__PURE__ */ jsx(ChevronLeft, { "data-icon": "inline-start" }),
                    "Anterior"
                  ]
                }
              ),
              onCancel && stepper.isFirst && /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: onCancel,
                  disabled: isLoading,
                  children: "Cancelar"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: stepper.isLast ? /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                disabled: isLoading,
                className: "bg-red-600 text-white hover:bg-red-700",
                children: isLoading ? /* @__PURE__ */ jsx("span", { className: "animate-pulse", children: "Guardando..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Save, { "data-icon": "inline-start" }),
                  isEditing ? "Guardar Cambios" : "Guardar Atleta"
                ] })
              }
            ) : /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                onClick: () => stepper.next(),
                disabled: isLoading,
                className: "bg-red-600 text-white hover:bg-red-700",
                children: [
                  "Siguiente",
                  /* @__PURE__ */ jsx(ChevronRight, { "data-icon": "inline-end" })
                ]
              }
            ) })
          ] })
        ] })
      ] })
    ] })
  ] });
};

const STEPS = [
  { label: "Datos Básicos", fields: BASIC_DATA_FIELDS },
  { label: "Contacto", fields: CONTACT_INFO_FIELDS },
  { label: "Deportiva", fields: SPORT_INFO_FIELDS }
];
const CoachForm = ({
  initialData,
  onSuccess,
  onCancel,
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
  setGeneralError: externalSetGeneralError
}) => {
  const isEditing = !!initialData;
  const [photoBase64, setPhotoBase64] = useState(void 0);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [localGeneralError, setLocalGeneralError] = useState(null);
  const isLoading = externalIsLoading !== void 0 ? externalIsLoading : localIsLoading;
  const setIsLoading = externalSetIsLoading || setLocalIsLoading;
  const setGeneralError = externalSetGeneralError || setLocalGeneralError;
  const generalError = externalSetGeneralError ? null : localGeneralError;
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    trigger,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(
      isEditing ? editCoachSchema : registerCoachSchema
    ),
    defaultValues: {
      nombre: "",
      tipoDocumento: "",
      cedula: "",
      genero: "Masculino",
      grupoSanguineo: "",
      fechaNacimiento: "",
      paisNacimiento: "",
      departamentoNacimiento: "",
      municipioNacimiento: "",
      grupoEtnico: "",
      nivelEducativo: "",
      eps: "",
      altura: "",
      peso: "",
      correo: "",
      paisResidencia: "",
      departamentoResidencia: "",
      municipioResidencia: "",
      barrio: "",
      direccion: "",
      estrato: "",
      telefonoFijo: "",
      telefono: "",
      discapacidad: "",
      usaSillaRuedas: "",
      usaSillaAtletica: "",
      club: "",
      fechaAfiliacion: "",
      liga: "",
      password: "",
      foto: "",
      tipoClase: "",
      claseDeportiva: "",
      especialidad: ""
    },
    mode: "onTouched"
  });
  const formValues = useWatch({ control });
  const validateCurrentStep = async () => {
    const fields = STEPS[stepper.currentStep]?.fields;
    if (!fields) return true;
    return trigger(fields);
  };
  const stepper = useMultiStep(STEPS.length, {
    onBeforeNext: validateCurrentStep
  });
  const watchDiscapacidad = formValues.discapacidad;
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        nombre: initialData.nombre || "",
        tipoDocumento: initialData.tipoDocumento || "",
        cedula: initialData.cedula || "",
        genero: initialData.genero || "Masculino",
        grupoSanguineo: initialData.grupoSanguineo || "",
        fechaNacimiento: initialData.fechaNacimiento || "",
        paisNacimiento: initialData.paisNacimiento || "",
        departamentoNacimiento: initialData.departamentoNacimiento || "",
        municipioNacimiento: initialData.municipioNacimiento || "",
        grupoEtnico: initialData.grupoEtnico || "",
        nivelEducativo: initialData.nivelEducativo || "",
        eps: initialData.eps || "",
        altura: initialData.altura || "",
        peso: initialData.peso || "",
        correo: initialData.correo || "",
        paisResidencia: initialData.paisResidencia || "",
        departamentoResidencia: initialData.departamentoResidencia || "",
        municipioResidencia: initialData.municipioResidencia || "",
        barrio: initialData.barrio || "",
        direccion: initialData.direccion || "",
        estrato: initialData.estrato || "",
        telefonoFijo: initialData.telefonoFijo || "",
        telefono: initialData.telefono || "",
        discapacidad: initialData.discapacidad || "",
        usaSillaRuedas: initialData.usaSillaRuedas || "",
        usaSillaAtletica: initialData.usaSillaAtletica || "",
        club: initialData.club || "",
        fechaAfiliacion: initialData.fechaAfiliacion || "",
        liga: initialData.liga || "",
        password: "",
        foto: initialData.foto || "",
        tipoClase: initialData.tipoClase || "",
        claseDeportiva: initialData.claseDeportiva || "",
        especialidad: initialData.especialidad || ""
      });
      setPhotoBase64(initialData.foto || void 0);
    }
    setGeneralError(null);
  }, [initialData, reset]);
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor, suba únicamente imágenes (.jpg, .png, .jpeg)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setPhotoBase64(base64);
      setValue("foto", base64);
    };
    reader.readAsDataURL(file);
  };
  const handleRemovePhoto = () => {
    setPhotoBase64(void 0);
    setValue("foto", "");
  };
  const onSubmit = async (data) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      const payload = { ...data };
      if (isEditing && initialData?.id) payload.id = initialData.id;
      if (isEditing && !payload.password) delete payload.password;
      const saved = await saveProfessor(payload);
      if (onSuccess) {
        onSuccess({ ...saved, ...data });
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      setGeneralError(
        error.message || "Ocurrió un error al guardar los datos del entrenador."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(UnsavedChangesGuard, { isDirty: isDirty && !isLoading }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", noValidate: true, children: [
      generalError && /* @__PURE__ */ jsx("div", { className: "animate-fade-in rounded-2xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed font-semibold text-red-600", children: generalError }),
      /* @__PURE__ */ jsx(StepIndicatorBar, { currentStep: stepper.currentStep, steps: STEPS }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-start gap-8 lg:grid-cols-12", children: [
        /* @__PURE__ */ jsxs("div", { className: `space-y-8 lg:col-span-4 ${stepper.currentStep === 0 ? "" : "hidden"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-6", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-4 block self-start text-xs font-bold tracking-wider text-slate-700 uppercase", children: "Foto de Perfil" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => document.getElementById("coach-modal-avatar-upload")?.click(),
                className: "group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-white transition-colors duration-200 hover:border-red-500",
                children: photoBase64 ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: photoBase64,
                    alt: "Avatar",
                    className: "h-full w-full object-cover"
                  }
                ) : /* @__PURE__ */ jsxs("div", { className: "p-4 text-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "material-icons-round text-3xl text-slate-400 transition-colors group-hover:text-red-500", children: "add_a_photo" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-[10px] font-bold tracking-wide text-slate-400 uppercase", children: "Subir Foto" })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "coach-modal-avatar-upload",
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handlePhotoChange,
                disabled: isLoading
              }
            ),
            photoBase64 && /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: handleRemovePhoto,
                disabled: isLoading,
                className: "mt-4 text-xs font-bold text-red-600 hover:text-red-700",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "material-icons-round text-sm", children: "delete" }),
                  "Eliminar Foto"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-100 bg-slate-50 p-6", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-4 block text-xs font-bold tracking-wider text-slate-700 uppercase", children: "Vista Previa" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-red-500/20 bg-slate-100", children: photoBase64 ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: photoBase64,
                  className: "h-full w-full object-cover",
                  alt: "Card Preview"
                }
              ) : /* @__PURE__ */ jsx("span", { className: "material-icons-round text-3xl text-slate-300", children: "person" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "truncate text-sm font-bold text-slate-900", children: formValues.nombre || "Nombre del Entrenador" }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase", children: formValues.especialidad || "Entrenador" }),
                /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: watchDiscapacidad && /* @__PURE__ */ jsx("span", { className: "rounded-md border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 capitalize", children: DISCAPACIDADES[watchDiscapacidad]?.nombre.replace("Discapacidad ", "") || watchDiscapacidad }) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `space-y-6 ${stepper.currentStep === 0 ? "lg:col-span-8" : "lg:col-span-12"}`, children: [
          /* @__PURE__ */ jsx("div", { className: stepper.currentStep === 0 ? "" : "hidden", children: /* @__PURE__ */ jsx(
            BasicDataStep,
            {
              register,
              control,
              errors,
              isLoading
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: stepper.currentStep === 1 ? "" : "hidden", children: /* @__PURE__ */ jsx(
            ContactInfoStep,
            {
              register,
              control,
              setValue,
              errors,
              isLoading
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: stepper.currentStep === 2 ? "" : "hidden", children: /* @__PURE__ */ jsx(
            SportInfoStep,
            {
              register,
              control,
              setValue,
              errors,
              isLoading,
              isEditing,
              isCoach: true
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              !stepper.isFirst && /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: stepper.prev,
                  disabled: isLoading,
                  children: [
                    /* @__PURE__ */ jsx(ChevronLeft, { "data-icon": "inline-start" }),
                    "Anterior"
                  ]
                }
              ),
              onCancel && stepper.isFirst && /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: onCancel,
                  disabled: isLoading,
                  children: "Cancelar"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: stepper.isLast ? /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                disabled: isLoading,
                className: "bg-red-600 text-white hover:bg-red-700",
                children: isLoading ? /* @__PURE__ */ jsx("span", { className: "animate-pulse", children: "Guardando..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Save, { "data-icon": "inline-start" }),
                  isEditing ? "Guardar Cambios" : "Guardar Entrenador"
                ] })
              }
            ) : /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                onClick: () => stepper.next(),
                disabled: isLoading,
                className: "bg-red-600 text-white hover:bg-red-700",
                children: [
                  "Siguiente",
                  /* @__PURE__ */ jsx(ChevronRight, { "data-icon": "inline-end" })
                ]
              }
            ) })
          ] })
        ] })
      ] })
    ] })
  ] });
};

export { AthleteForm as A, CoachForm as C };
