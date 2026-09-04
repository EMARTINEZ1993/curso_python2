import { useState, useContext, createContext, useEffect, useRef } from "react";

type Theme = {
  bg: string; surface: string; surface2: string;
  border: string; border2: string;
  text: string; text2: string; muted: string; subtle: string; faint: string;
  accent: string; accentBg: string;
  pyBlue: string; pyBlue2: string; pyYellow: string;
  codeBg: string; codeBar: string;
};

const ThemeCtx = createContext<Theme>({} as Theme);
const useT = () => useContext(ThemeCtx);

// En tema claro las categorías de colores se neutralizan a un gris pizarra
// para un aspecto más sobrio; en oscuro se conservan sus colores.
const LightCtx = createContext(false);
const LIGHT_NEUTRAL = "#64748b";

// `var(--x)` no admite un sufijo de alfa (`var(--x)44` es CSS inválido y el
// navegador cae en `currentColor`, que en claro pinta un borde casi negro).
// `tint` mezcla el color con transparente para lograr el mismo efecto.
const tint = (color: string, pct: number) =>
  `color-mix(in srgb, ${color} ${pct}%, transparent)`;
const useCat = () => {
  const light = useContext(LightCtx);
  return (hex: string) => (light ? LIGHT_NEUTRAL : hex);
};

// Temas que tienen taller con ejercicios para marcar.
const TALLER_TOPICS = ["tema1", "tema2", "tema3", "tema4"];
const PROGRESS_EVENT = "elipy-progress";

const readDone = (topicId: string): number[] => {
  try {
    const raw = localStorage.getItem(`elipy-taller-${topicId}`);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
};

// ─── Aparición al entrar en viewport ─────────────────────────────────────────

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal${shown ? " reveal-in" : ""}${className ? " " + className : ""}`}>
      {children}
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────

const TOPICS = [
  { id: "home", label: "Inicio", icon: "🏠" },
  { id: "requisitos", label: "Requisitos", icon: "📋" },
  { id: "intro", label: "Tema 0: Sintaxis básica", icon: "⚙️" },
  { id: "tema1", label: "Tema 1: Variables", icon: "📦" },
  { id: "tema2", label: "Tema 2: Condicionales", icon: "🔀" },
  { id: "tema3", label: "Tema 3: Ciclos", icon: "🔁" },
  { id: "tema4", label: "Tema 4: Manejo de errores", icon: "🛡️" },
  { id: "integrador", label: "Ejercicio Integrador", icon: "🏆" },
];

interface Exercise {
  id: string;
  title: string;
  description: string;
  code: string;
  input?: string;
  output?: string;
}

interface Workshop {
  items: string[];
}

interface Topic {
  title: string;
  description: string;
  exercises: Exercise[];
  workshop: Workshop;
}

const TOPIC_DATA: Record<string, Topic> = {
  intro: {
    title: "Ejercicio 0: Sintaxis Básica de Python",
    description:
      "Antes de resolver ejercicios con datos ingresados por el usuario, este ejercicio introductorio presenta la sintaxis básica de Python: cómo declarar variables de distintos tipos, mostrar su contenido en pantalla y combinar texto y variables de varias formas.",
    exercises: [
      {
        id: "vars",
        title: "sintaxis_basicas.py — Declaración y tipos",
        description:
          "Una variable permite almacenar un dato para utilizarlo posteriormente dentro del programa.",
        code: `# ============================================================
# INTRODUCCIÓN A LAS VARIABLES EN PYTHON
# ============================================================

# Una variable permite almacenar un dato para utilizarlo
# posteriormente dentro del programa.

nombre       = "Eli"       # Variable de tipo string (cadena de texto)
documento    = 123         # Variable de tipo int (número entero)
direccion    = "Medellín"  # Variable de tipo string (cadena de texto)
tiene_deudas = True        # Variable de tipo bool (booleano)


# ============================================================
# MOSTRAR EL CONTENIDO DE UNA VARIABLE
# ============================================================
print(nombre)

# ============================================================
# CONCATENACIÓN USANDO +
# ============================================================
print("CONCATENACIÓN USANDO +")
print("=" * 30)

# El operador + permite unir textos.
# Cuando usamos +, todos los elementos deben ser strings.
#
# documento es un entero (int), por lo que esta línea
# produciría un error:
#
# print("Mi nombre es: " + nombre + " y mi documento es: " + documento)

# Para solucionarlo, podemos convertir el número a texto
# utilizando str().
print("Mi nombre es: " + nombre + " y mi documento es: " + str(documento))


# ============================================================
# CONCATENACIÓN USANDO ,
# ============================================================
print("\\nCONCATENACIÓN USANDO ,")
print("=" * 30)

# Al utilizar comas, Python permite mostrar diferentes
# tipos de datos sin necesidad de convertirlos a string.
print("Mi nombre es:", nombre, "y mi documento es:", documento)


# ============================================================
# CONCATENACIÓN USANDO F-STRINGS
# ============================================================
print("\\nCONCATENACIÓN USANDO F-STRINGS")
print("=" * 30)

# Las f-strings permiten insertar variables directamente
# dentro de un texto.
#
# Se coloca la letra f antes de las comillas y las variables
# se escriben entre llaves { }.
print(f"Mi nombre es: {nombre} y mi documento es: {documento}")


# ============================================================
# F-STRINGS CON VARIAS VARIABLES
# ============================================================
print("\\nMOSTRAR VARIAS VARIABLES CON F-STRINGS")
print("=" * 30)

# Las f-strings también permiten crear textos
# de varias líneas utilizando triple comilla.
print(f"""
Nombre:         {nombre}
Documento:      {documento}
Dirección:      {direccion}
¿Tiene deudas?: {tiene_deudas}
""")


# ============================================================
# F-STRINGS CON COMILLAS SIMPLES
# ============================================================

# También podemos utilizar tres comillas simples (''')
# para crear textos de varias líneas.
print("=" * 30)

print(f"""
Nombre:         {nombre}
Documento:      {documento}
Dirección:      {direccion}
¿Tiene deudas?: {tiene_deudas}
""")


# SALTO DE LÍNEA EN PYTHON

# \\n representa un salto de línea.
# Salto de línea al inicio del texto
print(f"\\n Hola, {nombre}!")

# Salto de línea al final del texto
print(f"Bienvenida {nombre} a Python.\\n")`,
      },
      {
        id: "ops",
        title: "operadores.py — Operadores aritméticos",
        description:
          "Resumen completo de los operadores aritméticos disponibles en Python.",
        code: `# ============================================================
# OPERADORES ARITMÉTICOS EN PYTHON
# ============================================================
numero1 = 10
numero2 = 3

suma           = numero1 + numero2   # 13
resta          = numero1 - numero2   # 7
multiplicacion = numero1 * numero2   # 30
division       = numero1 / numero2   # 3.333...
division_entera= numero1 // numero2  # 3
residuo        = numero1 % numero2   # 1
potencia       = numero1 ** numero2  # 1000

print(f"""
Resultado de Operaciones Aritméticas:
suma:            {numero1} +  {numero2} = {suma}
resta:           {numero1} -  {numero2} = {resta}
multiplicacion:  {numero1} *  {numero2} = {multiplicacion}
division:        {numero1} /  {numero2} = {division:.4f}
division_entera: {numero1} // {numero2} = {division_entera}
residuo:         {numero1} %  {numero2} = {residuo}
potencia:        {numero1} ** {numero2} = {potencia}
""")`,
      },
    ],
    workshop: {
      items: [],
    },
  },

  tema1: {
    title: "Tema 1: Variables, Operaciones y Salida en Pantalla",
    description:
      "Se trabajan los conceptos básicos de variables, tipos de datos y operadores aritméticos en Python, junto con la lectura de datos desde el teclado mediante input() y la presentación de resultados con print().",
    exercises: [
      {
        id: "t1e1",
        title: "Ejercicio 1: Suma de dos números",
        description:
          "Solicitar al usuario dos números y mostrar su suma en pantalla.",
        code: `# Ejercicio 1: Suma de dos números
numero1 = float(input("Ingrese el primer número: "))
numero2 = float(input("Ingrese el segundo número: "))

suma = numero1 + numero2   # Se calcula la suma

print(f"La suma es: {suma}")`,
        input: "5, 3",
        output: "La suma es: 8.0",
      },
      {
        id: "t1e2",
        title: "Ejercicio 2: Área de un rectángulo",
        description:
          "Solicitar la base y la altura de un rectángulo y calcular su área.",
        code: `# Ejercicio 2: Área de un rectángulo
base   = float(input("Ingrese la base del rectángulo: "))
altura = float(input("Ingrese la altura del rectángulo: "))

area = base * altura   # fórmula: base × altura

print(f"El área del rectángulo es: {area}")`,
        input: "4, 6",
        output: "El área del rectángulo es: 24.0",
      },
      {
        id: "t1e3",
        title: "Ejercicio 3: Minutos a horas y minutos",
        description:
          "Solicitar una cantidad de minutos y mostrar a cuántas horas y minutos equivale.",
        code: `# Ejercicio 3: Conversión de minutos a horas y minutos
minutos_totales = int(input("Ingrese la cantidad de minutos: "))

horas   = minutos_totales // 60   # división entera → horas completas
minutos = minutos_totales % 60    # módulo → minutos restantes

print(f"{minutos_totales} minutos equivalen a {horas} horas y {minutos} minutos")`,
        input: "130",
        output: "130 minutos equivalen a 2 horas y 10 minutos",
      },
      {
        id: "t1e4",
        title: "Ejercicio 4: Precio con descuento",
        description:
          "Solicitar el precio de un producto y un porcentaje de descuento, y mostrar el valor final a pagar.",
        code: `# Ejercicio 4: Cálculo del precio con descuento
precio    = float(input("Ingrese el precio del producto: "))
descuento = float(input("Ingrese el porcentaje de descuento: "))

valor_descuento = precio * (descuento / 100)   # valor que se descuenta
precio_final    = precio - valor_descuento      # precio con descuento

print(f"El precio final a pagar es: {precio_final}")`,
        input: "100000, 20",
        output: "El precio final a pagar es: 80000.0",
      },
      {
        id: "t1e5",
        title: "Ejercicio 5: Intercambio de variables",
        description:
          "Solicitar dos números, intercambiar sus valores usando una variable auxiliar y mostrar el resultado.",
        code: `# Ejercicio 5: Intercambio de valores entre dos variables
a = float(input("Ingrese el valor de a: "))
b = float(input("Ingrese el valor de b: "))

auxiliar = a   # guardar temporalmente el valor de a
a = b          # a toma el valor de b
b = auxiliar   # b toma el valor original de a

print(f"Después del intercambio: a = {a} , b = {b}")`,
        input: "3, 9",
        output: "Después del intercambio: a = 9.0 , b = 3.0",
      },
    ],
    workshop: {
      items: [
        "Solicitar el largo y el ancho de un terreno rectangular y calcular su perímetro.",
        "Solicitar tres números y mostrar su promedio.",
        "Solicitar el nombre y la edad de una persona y mostrar un mensaje de presentación (ej: \"Hola, mi nombre es Ana y tengo 20 años\").",
        "Solicitar un valor en pesos colombianos y mostrar su equivalente aproximado en dólares (tasa fija: 1 USD = 4000 COP).",
        "Solicitar una cantidad de segundos y convertirla a horas, minutos y segundos.",
      ],
    },
  },

  tema2: {
    title: "Tema 2: Estructuras Condicionales",
    description:
      "Se introducen las estructuras condicionales if, elif y else, que permiten que un programa tome decisiones y ejecute distintos bloques de código según se cumplan o no ciertas condiciones.",
    exercises: [
      {
        id: "t2e1",
        title: "Ejercicio 1: Positivo, negativo o cero",
        description: "Solicitar un número y determinar si es positivo, negativo o cero.",
        code: `# Ejercicio 1: Determinar si un número es positivo, negativo o cero
numero = float(input("Ingrese un número: "))

if numero > 0:
    print(f"{numero} es positivo")
elif numero < 0:
    print(f"{numero} es negativo")
else:
    print("El número es cero")`,
        input: "-4",
        output: "-4.0 es negativo",
      },
      {
        id: "t2e2",
        title: "Ejercicio 2: Mayoría de edad",
        description:
          "Solicitar la edad de una persona y determinar si es mayor o menor de edad.",
        code: `# Ejercicio 2: Verificar si una persona es mayor de edad
edad = int(input("Ingrese su edad: "))

if edad >= 18:
    print("Es mayor de edad")
else:
    print("Es menor de edad")`,
        input: "16",
        output: "Es menor de edad",
      },
      {
        id: "t2e3",
        title: "Ejercicio 3: Par o impar",
        description: "Solicitar un número entero y determinar si es par o impar.",
        code: `# Ejercicio 3: Determinar si un número es par o impar
numero = int(input("Ingrese un número entero: "))

if numero % 2 == 0:      # si el residuo es 0 → es par
    print(f"{numero} es par")
else:
    print(f"{numero} es impar")`,
        input: "7",
        output: "7 es impar",
      },
      {
        id: "t2e4",
        title: "Ejercicio 4: Clasificación de nota académica",
        description:
          "Solicitar una nota entre 0.0 y 5.0 y clasificar el desempeño del estudiante.",
        code: `# Ejercicio 4: Clasificar una nota académica
nota = float(input("Ingrese la nota obtenida (0.0 a 5.0): "))

if nota >= 4.5:
    print("Desempeño superior")
elif nota >= 3.5:
    print("Desempeño alto")
elif nota >= 3.0:
    print("Desempeño básico")
else:
    print("Desempeño bajo")`,
        input: "3.8",
        output: "Desempeño alto",
      },
      {
        id: "t2e5",
        title: "Ejercicio 5: El mayor de tres números",
        description: "Solicitar tres números y determinar cuál es el mayor.",
        code: `# Ejercicio 5: Determinar el mayor de tres números
n1 = float(input("Ingrese el primer número: "))
n2 = float(input("Ingrese el segundo número: "))
n3 = float(input("Ingrese el tercer número: "))

if n1 >= n2 and n1 >= n3:
    mayor = n1
elif n2 >= n1 and n2 >= n3:
    mayor = n2
else:
    mayor = n3

print(f"El mayor de los tres números es: {mayor}")`,
        input: "4, 9, 6",
        output: "El mayor de los tres números es: 9.0",
      },
    ],
    workshop: {
      items: [
        `Elaborar un algoritmo que solicite el nombre y la edad de una persona y determine si es mayor o menor de edad.
- Se considera mayor de edad a partir de los 18 años.
- Validar que la edad ingresada no sea un valor negativo; si lo es, mostrar un mensaje de error.
- Si la persona es menor de edad, calcular y mostrar cuántos años le faltan para cumplir la mayoría de edad.
- Al finalizar, debe mostrar el nombre, la edad ingresada y el resultado correspondiente.`,
        `Elaborar un algoritmo que solicite el nombre de un estudiante y su calificación final, en una escala de 0.0 a 5.0.
- Se aprueba con una calificación igual o superior a 3.0.
- Debe validar que la calificación esté dentro del rango permitido (0.0 a 5.0); si no lo está, mostrar un mensaje de error y no continuar con la evaluación.
- Además de aprobado/reprobado, clasificar el desempeño: "Excelente" (4.5–5.0), "Bueno" (3.5–4.4), "Aceptable" (3.0–3.4) o "Insuficiente" (menor a 3.0).
- Al finalizar, debe mostrar el nombre del estudiante, la calificación ingresada, el resultado (aprueba o reprueba) y la clasificación del desempeño.`,
        `Elaborar un algoritmo que solicite el nombre de un cliente y el valor total de una compra, y calcule el descuento según el valor:
- Menos de $100.000 → sin descuento.
- Entre $100.000 y $299.999 → 10 % de descuento.
- Entre $300.000 y $499.999 → 15 % de descuento.
- $500.000 o más → 20 % de descuento.
- Validar que el valor de la compra sea mayor a cero; si no lo es, mostrar un mensaje de error.
- Al finalizar, debe mostrar el valor de la compra, el porcentaje de descuento aplicado, el valor descontado en pesos y el total a pagar.`,
        `Elaborar un algoritmo que solicite el nombre de una ciudad y la temperatura actual en grados Celsius, y la clasifique según estos rangos:
- Menor a 10 °C → "Muy fría".
- De 10 °C a 17 °C → "Fría".
- De 18 °C a 25 °C → "Templada".
- De 26 °C a 32 °C → "Caliente".
- Mayor a 32 °C → "Muy caliente".
- Adicionalmente, indicar si se recomienda llevar abrigo (temperaturas menores a 18 °C).
- Al finalizar, debe mostrar la ciudad, la temperatura registrada, su clasificación y la recomendación.`,
        `Elaborar un algoritmo que solicite el nombre de un empleado, las horas trabajadas durante el mes y el valor de cada hora.
- Las primeras 160 horas son horas normales y se pagan con la tarifa establecida.
- Las horas por encima de 160 son horas extra y se pagan al 125 % del valor de la hora normal.
- Validar que las horas trabajadas y el valor de la hora sean valores positivos.
- Calcular un descuento de salud y pensión equivalente al 8 % del salario total (bruto) y obtener el salario neto a pagar.
- Al finalizar, debe mostrar las horas normales, las horas extra, el pago por cada una, el salario total (bruto) y el salario neto después del descuento.`,
      ],
    },
  },

  tema3: {
    title: "Tema 3: Ciclos (for, while)",
    description:
      "Se trabajan las estructuras cíclicas for y while, que permiten repetir un bloque de código mientras se cumple una condición o mientras se recorre un rango de valores.",
    exercises: [
      {
        id: "t3e1",
        title: "Ejercicio 1: Tabla de multiplicar",
        description: "Solicitar un número y mostrar su tabla de multiplicar del 1 al 10.",
        code: `# Ejercicio 1: Mostrar la tabla de multiplicar de un número
numero = int(input("Ingrese un número para ver su tabla de multiplicar: "))

for i in range(1, 11):          # recorre los valores del 1 al 10
    print(f"{numero} x {i} = {numero * i}")`,
        input: "5",
        output: "5 x 1 = 5 … 5 x 10 = 50",
      },
      {
        id: "t3e2",
        title: "Ejercicio 2: Suma de los primeros n naturales",
        description:
          "Solicitar un número entero positivo n y calcular la suma de los primeros n números naturales.",
        code: `# Ejercicio 2: Sumar los primeros n números naturales
n = int(input("Ingrese un número entero positivo: "))

suma = 0
for i in range(1, n + 1):
    suma = suma + i

print(f"La suma de los primeros {n} números naturales es: {suma}")`,
        input: "5",
        output: "La suma de los primeros 5 números naturales es: 15",
      },
      {
        id: "t3e3",
        title: "Ejercicio 3: Contar pares con while",
        description:
          "Solicitar n y contar cuántos números pares hay entre 1 y n usando un ciclo while.",
        code: `# Ejercicio 3: Contar cuántos números pares hay entre 1 y n
n = int(input("Ingrese un número entero positivo: "))

contador = 0
numero   = 1
while numero <= n:
    if numero % 2 == 0:
        contador = contador + 1
    numero = numero + 1

print(f"Hay {contador} números pares entre 1 y {n}")`,
        input: "10",
        output: "Hay 5 números pares entre 1 y 10",
      },
      {
        id: "t3e4",
        title: "Ejercicio 4: Validar contraseña",
        description:
          "Solicitar una contraseña de forma repetida hasta que el usuario ingrese la correcta.",
        code: `# Ejercicio 4: Solicitar una contraseña hasta que sea correcta
clave_correcta  = "python2026"
clave_ingresada = input("Ingrese la contraseña: ")

while clave_ingresada != clave_correcta:
    print("Contraseña incorrecta, intente de nuevo")
    clave_ingresada = input("Ingrese la contraseña: ")

print("Contraseña correcta, acceso concedido")`,
        input: "python123, python2026",
        output: "Contraseña incorrecta, intente de nuevo → Contraseña correcta, acceso concedido",
      },
      {
        id: "t3e5",
        title: "Ejercicio 5: Factorial con for",
        description:
          "Solicitar un número entero no negativo y calcular su factorial usando un ciclo for.",
        code: `# Ejercicio 5: Calcular el factorial de un número
n = int(input("Ingrese un número entero no negativo: "))

factorial = 1
for i in range(1, n + 1):
    factorial = factorial * i

print(f"El factorial de {n} es: {factorial}")`,
        input: "5",
        output: "El factorial de 5 es: 120",
      },
    ],
    workshop: {
      items: [
        `Adivina el número — Ciclo while: genera un número entero aleatorio entre 1 y 10 y solicita al usuario que intente adivinarlo.
- Simular un ciclo do...while con while True + break, ya que Python no tiene esa estructura nativa.
- Repetir la pregunta mientras el número ingresado sea diferente al número generado.
- Mostrar un mensaje de acierto cuando el usuario adivine correctamente.`,
        `Cuenta regresiva — Ciclo while: solicita al usuario un número entero mayor que 0.
- Recorrer con un ciclo while desde ese número hasta 0, mostrando cada valor en la consola.
- Mostrar un mensaje indicando que la cuenta regresiva ha terminado.`,
        `Números impares — Ciclo for: recorre con un ciclo for los números enteros del 1 al 100.
- Identificar los números impares dentro de ese rango.
- Imprimir únicamente esos números en la consola.`,
        `Menú interactivo — Ciclo while: muestra en la consola un menú con las opciones 1) mensaje de bienvenida, 2) fecha y hora actual, 3) salir del programa.
- Mantener el menú activo con un ciclo while, solicitando una nueva opción después de cada acción.
- Finalizar el programa únicamente cuando el usuario seleccione la opción 3.`,
        `Registro de notas y cálculo del promedio — Ciclo for: solicita al usuario cuántas notas desea registrar.
- Recorrer esa cantidad con un ciclo for, pidiendo cada nota y acumulando sus valores.
- Calcular y mostrar el promedio al finalizar el registro.
- Indicar si el estudiante aprobó (promedio ≥ 3.0) o no aprobó.`,
      ],
    },
  },

  tema4: {
    title: "Tema 4: Manejo de Errores en Python",
    description:
      "El manejo de errores permite que un programa responda de forma controlada ante situaciones inesperadas, en lugar de detenerse abruptamente. Python usa try/except para capturar excepciones y continuar la ejecución de forma segura.",
    exercises: [
      {
        id: "t4e1",
        title: "Ejercicio 1: try / except básico",
        description:
          "Capturar el error que ocurre cuando el usuario ingresa un valor que no es un número.",
        code: `# Ejercicio 1: try / except básico
# Sin manejo de errores, ingresar "hola" en lugar de un número
# provocaría un ValueError y el programa se detendría.

try:
    numero = int(input("Ingrese un número entero: "))
    print(f"El número ingresado es: {numero}")
except ValueError:
    print("Error: debe ingresar un número entero válido.")`,
        input: "hola",
        output: "Error: debe ingresar un número entero válido.",
      },
      {
        id: "t4e2",
        title: "Ejercicio 2: División segura",
        description:
          "Capturar el error de división entre cero (ZeroDivisionError) al realizar una operación aritmética.",
        code: `# Ejercicio 2: División segura con ZeroDivisionError
try:
    dividendo = float(input("Ingrese el dividendo: "))
    divisor   = float(input("Ingrese el divisor: "))
    resultado = dividendo / divisor
    print(f"Resultado: {dividendo} / {divisor} = {resultado}")
except ZeroDivisionError:
    print("Error: no es posible dividir entre cero.")
except ValueError:
    print("Error: ingrese únicamente valores numéricos.")`,
        input: "10, 0",
        output: "Error: no es posible dividir entre cero.",
      },
      {
        id: "t4e3",
        title: "Ejercicio 3: else y finally",
        description:
          "Usar el bloque else (se ejecuta si no hubo error) y finally (se ejecuta siempre, haya o no error).",
        code: `# Ejercicio 3: else y finally
# else  → se ejecuta solo si NO ocurrió ninguna excepción
# finally → se ejecuta SIEMPRE, con o sin error

try:
    edad = int(input("Ingrese su edad: "))
except ValueError:
    print("Error: la edad debe ser un número entero.")
else:
    if edad >= 18:
        print("Acceso permitido.")
    else:
        print("Acceso denegado: debe ser mayor de edad.")
finally:
    print("Verificación finalizada.")`,
        input: "veinte",
        output: "Error: la edad debe ser un número entero.\nVerificación finalizada.",
      },
      {
        id: "t4e4",
        title: "Ejercicio 4: Múltiples excepciones y bucle de reintento",
        description:
          "Combinar un ciclo while con try/except para pedirle al usuario que reintente hasta ingresar un valor válido.",
        code: `# Ejercicio 4: Solicitar un dato válido hasta que el usuario lo ingrese correctamente
while True:
    try:
        nota = float(input("Ingrese una nota entre 0.0 y 5.0: "))
        if nota < 0.0 or nota > 5.0:
            raise ValueError("La nota debe estar entre 0.0 y 5.0.")
        break   # sale del ciclo si el valor es válido
    except ValueError as e:
        print(f"Entrada inválida: {e}. Intente de nuevo.")

print(f"Nota registrada: {nota}")`,
        input: "-1, abc, 6, 4.5",
        output: "Entrada inválida × 3 → Nota registrada: 4.5",
      },
      {
        id: "t4e5",
        title: "Ejercicio 5: raise — lanzar errores personalizados",
        description:
          "Usar raise para generar una excepción manualmente cuando los datos no cumplen una condición de negocio.",
        code: `# Ejercicio 5: raise — lanzar una excepción personalizada
def calcular_promedio(notas):
    if len(notas) == 0:
        raise ValueError("La lista de notas no puede estar vacía.")
    return sum(notas) / len(notas)

try:
    n      = int(input("¿Cuántas notas va a ingresar? "))
    notas  = []
    for i in range(n):
        nota = float(input(f"  Nota {i + 1}: "))
        notas.append(nota)
    promedio = calcular_promedio(notas)
    print(f"Promedio: {round(promedio, 2)}")
except ValueError as e:
    print(f"Error: {e}")`,
        input: "0 notas",
        output: "Error: La lista de notas no puede estar vacía.",
      },
    ],
    workshop: {
      items: [
        "Solicitar al usuario dos números y un operador (+, -, *, /). Manejar con try/except la división entre cero y la entrada no numérica.",
        "Pedir el nombre de un archivo al usuario e intentar abrirlo con open(). Capturar FileNotFoundError y mostrar un mensaje claro.",
        "Solicitar una fecha en formato DD/MM/AAAA. Usar try/except para capturar ValueError si el formato o los valores son inválidos.",
        "Crear una función raiz_cuadrada(n) que lance ValueError si n es negativo. Llamarla dentro de un try/except e informar al usuario.",
        "Solicitar números al usuario en un ciclo hasta que ingrese 'fin'. Acumular los válidos con try/except e ignorar los inválidos, mostrando al final la cantidad de valores aceptados y su promedio.",
      ],
    },
  },

  integrador: {
    title: "Ejercicio Integrador: Sistema de Notas con Manejo de Errores",
    description:
      "Ejercicio final que combina variables, operadores, condicionales, ciclos y manejo de errores en una sola solución. El programa registra y evalúa las notas de un grupo de estudiantes de forma robusta, validando cada entrada del usuario.",
    exercises: [
      {
        id: "int_e1",
        title: "Sistema de Registro y Evaluación de Notas (con try/except)",
        description:
          "El programa solicita la cantidad de estudiantes, sus nombres y tres notas por estudiante. Cada entrada numérica está protegida con try/except para evitar que el programa se detenga si el usuario ingresa un valor inválido. Al final muestra el resumen general del grupo.",
        code: `# ============================================================
# EJERCICIO INTEGRADOR
# Registro y evaluación de notas con manejo de errores
# Combina: variables, condicionales, ciclos y try/except
# ============================================================

# ── Función auxiliar: solicitar un número en un rango ───────
def pedir_numero(mensaje, minimo, maximo):
    """Repite la solicitud hasta recibir un float en [minimo, maximo]."""
    while True:
        try:
            valor = float(input(mensaje))
            if valor < minimo or valor > maximo:
                raise ValueError(f"El valor debe estar entre {minimo} y {maximo}.")
            return valor
        except ValueError as e:
            print("  Entrada inválida: " + str(e) + " Intente de nuevo.")

# ── Solicitar cantidad de estudiantes ───────────────────────
while True:
    try:
        cantidad_estudiantes = int(input("Ingrese la cantidad de estudiantes: "))
        if cantidad_estudiantes <= 0:
            raise ValueError("Debe ser un número entero positivo.")
        break
    except ValueError as e:
        print("  Error: " + str(e) + " Intente de nuevo.")

# ── Variables acumuladoras ───────────────────────────────────
suma_promedios_grupo = 0
total_aprobados      = 0
total_reprobados     = 0

# ── Registro de cada estudiante ──────────────────────────────
for estudiante in range(1, cantidad_estudiantes + 1):
    print("\\n--- Estudiante", estudiante, "---")

    nombre = input("Nombre del estudiante: ").strip()
    if not nombre:
        nombre = f"Estudiante {estudiante}"   # nombre por defecto si queda vacío

    # Cada nota se valida entre 0.0 y 5.0
    nota1 = pedir_numero("  Primera nota  (0.0 – 5.0): ", 0.0, 5.0)
    nota2 = pedir_numero("  Segunda nota  (0.0 – 5.0): ", 0.0, 5.0)
    nota3 = pedir_numero("  Tercera nota  (0.0 – 5.0): ", 0.0, 5.0)

    promedio = (nota1 + nota2 + nota3) / 3

    if promedio >= 3.0:
        estado           = "✔ Aprobado"
        total_aprobados  = total_aprobados + 1
    else:
        estado           = "✘ Reprobado"
        total_reprobados = total_reprobados + 1

    print("  " + nombre, "→ Promedio:", round(promedio, 2), "—", estado)
    suma_promedios_grupo = suma_promedios_grupo + promedio

# ── Resumen final ────────────────────────────────────────────
try:
    promedio_grupo = suma_promedios_grupo / cantidad_estudiantes
except ZeroDivisionError:
    promedio_grupo = 0.0

print()
print("=" * 35)
print("        RESUMEN DEL GRUPO")
print("=" * 35)
print("Total de estudiantes :", cantidad_estudiantes)
print("Aprobados            :", total_aprobados)
print("Reprobados           :", total_reprobados)
print("Promedio general     :", round(promedio_grupo, 2))
print("=" * 35)`,
        input: "2 estudiantes — Ana: 4.0, 3.5, 4.5 | Luis: 2.0, 2.5, 3.0",
        output:
          "Ana → Promedio: 4.0 — ✔ Aprobado / Luis → Promedio: 2.5 — ✘ Reprobado / Promedio general: 3.25",
      },
    ],
    workshop: { items: [] },
  },
};

// ─── Topic Context ────────────────────────────────────────────────────────────

const TOPIC_CONTEXT: Record<string, { subtitle: string; what: string; why: string; concepts: { label: string; desc: string; color: string }[] }> = {
  intro: {
    subtitle: "El primer paso antes de programar",
    what: "Antes de resolver problemas reales, es fundamental entender cómo Python interpreta y almacena información. Este ejercicio introductorio muestra cómo declarar variables, qué tipos de datos existen y cómo mostrar resultados en pantalla de distintas formas.",
    why: "Saber manejar variables y mostrar datos es la base de cualquier programa. Sin esto, no es posible guardar resultados ni comunicarle nada al usuario.",
    concepts: [
      { label: "Variable", desc: "Espacio en memoria con nombre que guarda un valor", color: "#79c0ff" },
      { label: "Tipo de dato", desc: "Naturaleza del valor: texto (str), número (int, float) o lógico (bool)", color: "#f7c948" },
      { label: "print()", desc: "Función que muestra información en la consola", color: "#3dd68c" },
      { label: "f-string", desc: "Forma moderna de insertar variables dentro de un texto", color: "#bc8cff" },
    ],
  },
  tema1: {
    subtitle: "Guardar, operar y mostrar información",
    what: "En este tema aprendes a declarar variables, asignarles valores, realizar operaciones matemáticas con ellas y pedir datos al usuario con input(). Es la base sobre la que se construye cualquier algoritmo.",
    why: "Todo programa necesita almacenar datos temporalmente para procesarlos. Las variables son el mecanismo fundamental para hacerlo; sin ellas no podría existir ningún cálculo ni lógica.",
    concepts: [
      { label: "input()", desc: "Captura un valor escrito por el usuario desde el teclado", color: "#79c0ff" },
      { label: "int / float", desc: "Conversión de texto a número entero o decimal", color: "#f7c948" },
      { label: "Operadores +−×÷", desc: "Permiten realizar cálculos aritméticos entre valores", color: "#3dd68c" },
      { label: "// y %", desc: "División entera y residuo; claves para conversiones de unidades", color: "#ff7b72" },
    ],
  },
  tema2: {
    subtitle: "Tomar decisiones dentro del código",
    what: "Las estructuras condicionales permiten que el programa evalúe una condición y ejecute distintos bloques de código según el resultado. En Python se escriben con if, elif y else.",
    why: "La lógica de cualquier sistema real depende de condiciones: si el usuario es mayor de edad, si la nota es suficiente, si el número es par. Sin condicionales, todos los programas ejecutarían siempre lo mismo.",
    concepts: [
      { label: "if", desc: "Ejecuta un bloque solo si la condición es verdadera", color: "#3dd68c" },
      { label: "elif", desc: "Evalúa una segunda condición si la anterior fue falsa", color: "#f7c948" },
      { label: "else", desc: "Se ejecuta cuando ninguna condición anterior se cumplió", color: "#79c0ff" },
      { label: "Operadores de comparación", desc: "==, !=, >, <, >=, <= comparan dos valores y retornan True o False", color: "#bc8cff" },
    ],
  },
  tema3: {
    subtitle: "Repetir acciones de forma controlada",
    what: "Los ciclos permiten ejecutar un bloque de código múltiples veces. Python ofrece dos tipos: for, que recorre un rango o secuencia de valores, y while, que repite mientras una condición sea verdadera.",
    why: "Automatizar la repetición es el núcleo de la computación. Sin ciclos, habría que escribir el mismo código decenas o cientos de veces. Los ciclos hacen que los programas sean escalables y eficientes.",
    concepts: [
      { label: "for", desc: "Recorre un rango o lista; el número de repeticiones es conocido", color: "#3dd68c" },
      { label: "while", desc: "Repite mientras la condición sea True; útil cuando no se sabe cuántas veces", color: "#f7c948" },
      { label: "range()", desc: "Genera una secuencia de números para iterar con for", color: "#79c0ff" },
      { label: "Acumuladores", desc: "Variables que van sumando o contando a lo largo del ciclo", color: "#ff7b72" },
    ],
  },
  tema4: {
    subtitle: "Controlar lo inesperado",
    what: "El manejo de errores permite anticipar situaciones donde el programa podría fallar — una entrada incorrecta, una división entre cero, un archivo inexistente — y responder de forma controlada en lugar de detenerse abruptamente. Python usa try/except para capturar excepciones en tiempo de ejecución.",
    why: "Un programa que no maneja errores es frágil: basta con que el usuario escriba mal un valor para que todo se rompa. El manejo de excepciones convierte un programa inestable en uno robusto y confiable.",
    concepts: [
      { label: "try / except", desc: "Bloque que intenta ejecutar código y captura el error si ocurre", color: "#3dd68c" },
      { label: "ValueError", desc: "Excepción cuando el valor tiene el tipo correcto pero un contenido inválido", color: "#ff7b72" },
      { label: "else / finally", desc: "else ejecuta si no hubo error; finally ejecuta siempre", color: "#f7c948" },
      { label: "raise", desc: "Lanza una excepción manualmente cuando los datos no cumplen una regla", color: "#bc8cff" },
    ],
  },
  integrador: {
    subtitle: "Variables + condicionales + ciclos + manejo de errores",
    what: "El ejercicio integrador reúne todos los temas del módulo en un sistema real de registro de notas. Cada entrada del usuario está protegida con try/except, los datos se validan con raise, y el resumen final se calcula de forma segura evitando divisiones entre cero.",
    why: "Un sistema real nunca puede asumir que el usuario ingresará datos perfectos. Integrar el manejo de errores desde el diseño —no como un parche final— es lo que distingue un script de un programa confiable.",
    concepts: [
      { label: "Función auxiliar", desc: "pedir_numero() encapsula la validación y el ciclo de reintento", color: "#3dd68c" },
      { label: "raise + ValueError", desc: "Lanza una excepción si el valor está fuera del rango permitido", color: "#ff7b72" },
      { label: "Acumuladores", desc: "Variables que suman promedios y cuentan aprobados/reprobados a lo largo del ciclo", color: "#f7c948" },
      { label: "ZeroDivisionError", desc: "Protege el cálculo del promedio grupal ante una lista vacía", color: "#bc8cff" },
    ],
  },
};

// ─── Requirements Page ───────────────────────────────────────────────────────

function RequirementsPage() {
  const T = useT();
  const cat = useCat();

  const files = [
    { name: "sintaxis_basicas.py", topic: "Ejercicio 0", desc: "Introducción a variables, tipos de datos y formas de mostrar texto en pantalla", color: "#4B8BBE" },
    { name: "operadores.py", topic: "Ejercicio 0", desc: "Operadores aritméticos disponibles en Python", color: "#4B8BBE" },
    { name: "variables.py", topic: "Tema 1", desc: "Variables, operaciones y salida en pantalla", color: "#3dd68c" },
    { name: "condicionales.py", topic: "Tema 2", desc: "Estructuras condicionales (if, elif, else)", color: "#f7c948" },
    { name: "ciclos.py", topic: "Tema 3", desc: "Ciclos for y while", color: "#ff7b72" },
    { name: "errores.py", topic: "Tema 4", desc: "Manejo de errores con try/except", color: "#bc8cff" },
    { name: "integrador.py", topic: "Integrador", desc: "Sistema de registro y evaluación de notas", color: "#79c0ff" },
  ];

  const vsSteps = [
    {
      num: "01",
      title: "Instalar Visual Studio Code",
      desc: "Descargar VS Code desde code.visualstudio.com e instalarlo. Es gratuito y disponible para Windows, Mac y Linux.",
      extra: null,
    },
    {
      num: "02",
      title: "Instalar la extensión de Python",
      desc: "Abrir VS Code → ir al panel de extensiones (Ctrl+Shift+X) → buscar \"Python\" → instalar la extensión oficial de Microsoft.",
      extra: null,
    },
    {
      num: "03",
      title: 'Crear la carpeta "python_1"',
      desc: 'En el explorador de archivos del sistema, crear una carpeta llamada python_1 en un lugar accesible (por ejemplo: Documentos/python_1).',
      extra: (T: ReturnType<typeof useT>) => (
        <div className="mt-3 rounded-lg px-4 py-3 font-mono text-xs" style={{ background: T.codeBg, color: T.accent, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${T.border}` }}>
          📁 Documentos/<span style={{ color: T.pyYellow }}>python_1</span>/
        </div>
      ),
    },
    {
      num: "04",
      title: "Abrir la carpeta en VS Code",
      desc: 'En VS Code: Archivo → Abrir carpeta → seleccionar "python_1". Esto convierte la carpeta en tu espacio de trabajo.',
      extra: null,
    },
    {
      num: "05",
      title: "Crear los archivos .py",
      desc: 'En el explorador de VS Code, hacer clic derecho → "Nuevo archivo" y crear un archivo .py para cada tema del taller.',
      extra: (T: ReturnType<typeof useT>) => (
        <div className="mt-3 rounded-lg px-4 py-3 font-mono text-xs space-y-1" style={{ background: T.codeBg, border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono', monospace" }}>
          <div>📁 <span style={{ color: T.pyYellow }}>python_1</span>/</div>
          {["sintaxis_basicas.py", "operadores.py", "variables.py", "condicionales.py", "ciclos.py", "errores.py", "integrador.py"].map((f, i) => (
            <div key={f} className="ml-4" style={{ color: ["#4B8BBE","#4B8BBE","#3dd68c","#f7c948","#ff7b72","#bc8cff","#79c0ff"][i] }}>
              └── {f}
            </div>
          ))}
        </div>
      ),
    },
    {
      num: "06",
      title: "Ejecutar un archivo",
      desc: 'Con el archivo abierto en VS Code, presionar el botón ▶ (Run Python File) en la esquina superior derecha, o usar el terminal integrado con el comando python variables.py.',
      extra: (T: ReturnType<typeof useT>) => (
        <div className="mt-3 rounded-lg px-4 py-3 font-mono text-xs" style={{ background: T.codeBg, color: T.muted, border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono', monospace" }}>
          <span style={{ color: T.subtle }}>$</span> <span style={{ color: T.accent }}>python</span> sintaxis_basicas.py
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div
          className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border"
          style={{ fontFamily: "'JetBrains Mono', monospace", borderColor: tint(T.pyBlue, 27), color: T.pyBlue, background: tint(T.pyBlue, 7) }}
        >
          📋 Requisitos del taller
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: T.text }}>
          Antes de empezar
        </h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: T.muted }}>
          Para completar el taller necesitas tener Python instalado y un editor de código configurado. Si no tienes Python en tu computador, también puedes usar un entorno en línea sin instalar nada.
        </p>
      </div>

      {/* Option A: Online */}
      <div className="rounded-2xl border p-5 sm:p-6 space-y-4" style={{ borderColor: tint(T.accent, 27), background: T.surface }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: T.accentBg }}>
            🌐
          </div>
          <div>
            <div className="font-bold text-base" style={{ color: T.text }}>Opción A — Sin instalación (recomendada para empezar)</div>
            <div className="text-xs" style={{ color: T.muted }}>Ideal si no tienes Python instalado en tu computador</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
          Puedes escribir y ejecutar código Python directamente desde el navegador usando <strong style={{ color: T.text }}>Online Python</strong>. No requiere instalar nada. Solo abre el enlace, pega tu código y presiona <strong style={{ color: T.accent }}>Run</strong>.
        </p>
        <a
          href="https://www.online-python.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
          style={{ background: T.accentBg, color: T.accent, border: `1px solid ${tint(T.accent, 27)}`, textDecoration: "none" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.accent; (e.currentTarget as HTMLElement).style.color = T.bg; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.accentBg; (e.currentTarget as HTMLElement).style.color = T.accent; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Abrir online-python.com
        </a>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {[
            { icon: "✍️", label: "Escribe tu código", desc: "Pega o escribe el código del ejercicio en el editor" },
            { icon: "▶", label: "Presiona Run", desc: "Haz clic en el botón Run para ejecutar el programa" },
            { icon: "📤", label: "Ve el resultado", desc: "La salida aparece en el panel inferior de la pantalla" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 space-y-1" style={{ background: T.surface2 }}>
              <div className="text-base">{s.icon}</div>
              <div className="text-xs font-semibold" style={{ color: T.text }}>{s.label}</div>
              <div className="text-xs" style={{ color: T.subtle }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Option B: VS Code */}
      <div className="rounded-2xl border p-5 sm:p-6 space-y-6" style={{ borderColor: tint(T.pyBlue, 27), background: T.surface }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: tint(T.pyBlue, 9) }}>
            💻
          </div>
          <div>
            <div className="font-bold text-base" style={{ color: T.text }}>Opción B — Visual Studio Code (instalación local)</div>
            <div className="text-xs" style={{ color: T.muted }}>Requerido para entregar los archivos .py del taller</div>
          </div>
        </div>

        {/* Requirements checklist */}
        <div className="rounded-xl p-4 space-y-2" style={{ background: T.surface2 }}>
          <div className="text-xs font-mono font-semibold mb-3" style={{ color: T.pyBlue, fontFamily: "'JetBrains Mono', monospace" }}>
            REQUISITOS TÉCNICOS
          </div>
          {[
            { icon: "🐍", label: "Python 3.x", detail: 'Descargar desde python.org — marcar la opción "Add Python to PATH" al instalar' },
            { icon: "🖊️", label: "Visual Studio Code", detail: "Editor de código gratuito de Microsoft — code.visualstudio.com" },
            { icon: "🔌", label: "Extensión Python (VS Code)", detail: "Instalar desde el marketplace de VS Code — autor: Microsoft" },
          ].map(r => (
            <div key={r.label} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: T.border }}>
              <span className="text-base mt-0.5">{r.icon}</span>
              <div>
                <div className="text-sm font-semibold" style={{ color: T.text }}>{r.label}</div>
                <div className="text-xs mt-0.5" style={{ color: T.subtle }}>{r.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Step by step */}
        <div className="space-y-1">
          <div className="text-xs font-mono font-semibold mb-4" style={{ color: T.pyBlue, fontFamily: "'JetBrains Mono', monospace" }}>
            CONFIGURACIÓN PASO A PASO
          </div>
          <div className="space-y-4">
            {vsSteps.map(step => (
              <div key={step.num} className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: tint(T.pyBlue, 9), color: T.pyBlue, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {step.num}
                </div>
                <div className="flex-1 pb-4 border-b last:border-0" style={{ borderColor: T.border }}>
                  <div className="font-semibold text-sm mb-1" style={{ color: T.text }}>{step.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: T.muted }}>{step.desc}</div>
                  {step.extra && step.extra(T)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Files to create */}
      <div className="rounded-2xl border p-5 sm:p-6 space-y-4" style={{ borderColor: tint(T.pyYellow, 27), background: T.surface }}>
        <div className="text-xs font-mono font-semibold" style={{ color: T.pyYellow, fontFamily: "'JetBrains Mono', monospace" }}>
          ARCHIVOS A ENTREGAR
        </div>
        <p className="text-sm" style={{ color: T.muted }}>
          Dentro de la carpeta <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: T.surface2, color: T.pyYellow, fontFamily: "'JetBrains Mono', monospace" }}>python_1</code>, crear un archivo <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: T.surface2, color: T.text2, fontFamily: "'JetBrains Mono', monospace" }}>.py</code> por cada tema con los ejercicios resueltos.
        </p>
        <div className="space-y-2">
          {files.map(f => {
            const fc = cat(f.color);
            return (
            <div
              key={f.name}
              className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3 rounded-xl border"
              style={{ borderColor: fc + "30", background: T.surface2 }}
            >
              <span className="font-mono text-sm font-semibold" style={{ color: fc, fontFamily: "'JetBrains Mono', monospace" }}>
                {f.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: fc + "18", color: fc }}>
                {f.topic}
              </span>
              <span className="text-xs w-full sm:w-auto sm:ml-auto sm:text-right" style={{ color: T.subtle }}>{f.desc}</span>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

// ─── Welcome / nombre animado ────────────────────────────────────────────────

function AnimatedName({ text }: { text: string }) {
  const chars = Array.from(text);
  return (
    <div className="inline-block max-w-full">
      <div className="name-reveal text-2xl sm:text-4xl md:text-5xl" aria-label={text}>
        {chars.map((ch, i) => (
          <span key={i} className="ch" aria-hidden="true" style={{ animationDelay: `${Math.min(i * 0.028, 0.45)}s` }}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </div>
      <div className="name-underline mt-2.5" style={{ width: "100%" }} />
    </div>
  );
}

function WelcomeName({ name, onSet }: { name: string; onSet: (n: string) => void }) {
  const T = useT();
  const light = useContext(LightCtx);
  const onAccent = light ? "#ffffff" : "#0d1117";
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(!name);
  const [runKey, setRunKey] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = draft.trim().replace(/\s+/g, " ").slice(0, 40);
    if (!clean) return;
    onSet(clean);
    setDraft("");
    setEditing(false);
    setRunKey((k) => k + 1);
  };

  if (editing) {
    return (
      <div
        className="rounded-xl border p-5 flex flex-col gap-4 sm:flex-row sm:items-center"
        style={{ borderColor: T.border, background: T.surface }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold" style={{ color: T.text }}>¿Cómo te llamas?</div>
          <div className="text-xs mt-0.5" style={{ color: T.subtle }}>
            Personaliza el taller. Se guarda solo en este navegador.
          </div>
        </div>
        <form onSubmit={submit} className="flex gap-2 w-full sm:w-auto">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            maxLength={40}
            placeholder="Tu nombre"
            className="flex-1 sm:w-52 px-3.5 py-2 rounded-lg text-sm transition-colors"
            style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.text }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer transition-all flex-shrink-0"
            style={{ background: T.accent, color: onAccent }}
          >
            Guardar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <div className="text-xs mb-1.5" style={{ color: T.subtle }}>Hola,</div>
        <AnimatedName key={runKey} text={name} />
      </div>
      <button
        onClick={() => { setDraft(name); setEditing(true); }}
        className="text-xs cursor-pointer transition-colors pb-1"
        style={{ color: T.faint, background: "transparent" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--subtle)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--faint)")}
      >
        Cambiar nombre
      </button>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({
  onNavigate,
  userName,
  onSetName,
}: {
  onNavigate: (id: string) => void;
  userName: string;
  onSetName: (n: string) => void;
}) {
  const T = useT();
  const cat = useCat();
  const modules = [
    { id: "intro", icon: "⚙️", label: "Tema 0: Sintaxis básica", color: "#4B8BBE", desc: "Variables, tipos de datos, print() y f-strings. El punto de partida." },
    { id: "tema1", icon: "📦", label: "Tema 1: Variables", color: "#3dd68c", desc: "Operadores aritméticos, input() y transformación de datos." },
    { id: "tema2", icon: "🔀", label: "Tema 2: Condicionales", color: "#f7c948", desc: "if, elif, else — decisiones lógicas dentro del programa." },
    { id: "tema3", icon: "🔁", label: "Tema 3: Ciclos", color: "#ff7b72", desc: "for y while — automatizar la repetición de acciones." },
    { id: "tema4", icon: "🛡️", label: "Tema 4: Manejo de errores", color: "#bc8cff", desc: "try/except, raise y finally — hacer programas robustos." },
    { id: "integrador", icon: "🏆", label: "Ejercicio Integrador", color: "#f7c948", desc: "Sistema de notas que combina todo lo aprendido." },
  ];

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-4xl mx-auto space-y-10 sm:space-y-12">
      {/* Bienvenida con nombre animado */}

      {/* Hero */}
      <div className="space-y-4">
        <div
          className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border max-w-full"
          style={{ fontFamily: "'JetBrains Mono', monospace", borderColor: tint(T.accent, 27), color: T.accent, background: T.accentBg }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-shrink-0" />
          <span className="truncate">Técnico en Programación · Diseño de APP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: T.text }}>
          Algoritmos y Lógica<br />
          <span style={{ color: T.accent }}>con Python</span>
        </h1>
        <p className="text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: T.muted }}>
          Material anexo del <strong style={{ color: T.text2 }}>Taller 0</strong> de COMPUESTUDIO. Este módulo desarrolla la capacidad de análisis lógico a través de la construcción progresiva de algoritmos en Python, partiendo de variables simples hasta un sistema completo de evaluación de estudiantes.
        </p>
      </div>

      {/* What is an algorithm */}
      <Reveal>
      <div className="rounded-2xl border p-5 sm:p-7 space-y-5" style={{ borderColor: T.border, background: T.surface }}>
        <h2 className="text-lg font-bold" style={{ color: T.text }}>¿Qué es un algoritmo?</h2>
        <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
          Un <strong style={{ color: T.text2 }}>algoritmo</strong> es una secuencia finita de instrucciones ordenadas que resuelven un problema específico. Cada paso debe ser preciso, sin ambigüedad, y el proceso debe terminar en algún momento. Cuando escribimos código, estamos traduciendo un algoritmo al lenguaje que la computadora entiende.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { num: "01", title: "Entrada", desc: "Los datos que recibe el programa (input del usuario, archivos, sensores)." },
            { num: "02", title: "Proceso", desc: "Las instrucciones que transforman la entrada: cálculos, decisiones, repeticiones." },
            { num: "03", title: "Salida", desc: "El resultado que el programa entrega: texto en pantalla, archivos, acciones." },
          ].map((item) => (
            <div key={item.num} className="rounded-xl p-4 space-y-2" style={{ background: T.surface2 }}>
              <div className="font-mono text-xs" style={{ color: T.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.num}</div>
              <div className="font-semibold text-sm" style={{ color: T.text }}>{item.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: T.subtle }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
      </Reveal>

      {/* Why Python */}
      <Reveal>
      <div className="rounded-2xl border p-5 sm:p-7 space-y-4" style={{ borderColor: T.border, background: T.surface }}>
        <h2 className="text-lg font-bold" style={{ color: T.text }}>¿Por qué Python?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "📖", title: "Sintaxis legible", desc: "El código se parece al inglés cotidiano, lo que facilita aprender a leer y escribir programas." },
            { icon: "🧰", title: "Versátil", desc: "Se usa en desarrollo web, inteligencia artificial, análisis de datos, automatización y más." },
            { icon: "🌍", title: "Comunidad enorme", desc: "Miles de recursos, tutoriales y bibliotecas disponibles de forma gratuita en línea." },
            { icon: "🚀", title: "Muy demandado", desc: "Python es uno de los lenguajes más solicitados en el mercado laboral tecnológico mundial." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: T.surface2 }}>
              <span className="text-xl mt-0.5">{item.icon}</span>
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: T.text }}>{item.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: T.subtle }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </Reveal>

      {/* Module map */}
      <Reveal>
      <div className="space-y-3">
        <h2 className="text-lg font-bold" style={{ color: T.text }}>Contenido del taller</h2>
        <p className="text-sm" style={{ color: T.subtle }}>
          El taller está organizado en cuatro temas progresivos más un ejercicio integrador. Cada tema incluye ejercicios resueltos y un taller para practicar.
        </p>
        <div className="space-y-2 mt-4">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => onNavigate(m.id)}
              className="w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer"
              style={{ borderColor: T.border, background: T.surface }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.background = "var(--surface2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{ background: `${cat(m.color)}22` }}
              >
                {m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: T.text }}>{m.label}</div>
                <div className="text-xs mt-0.5" style={{ color: T.subtle }}>{m.desc}</div>
              </div>
              <span className="text-xs font-mono flex-shrink-0" style={{ color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>→</span>
            </button>
          ))}
        </div>
      </div>
      </Reveal>

      {/* Objective */}
      <Reveal>
      <div className="rounded-2xl p-5 sm:p-6 border" style={{ borderColor: tint(T.accent, 20), background: T.accentBg }}>
        <div className="text-xs font-mono mb-2" style={{ color: T.accent, fontFamily: "'JetBrains Mono', monospace" }}>
          OBJETIVO DEL MÓDULO
        </div>
        <p className="text-sm leading-relaxed" style={{ color: T.text2 }}>
          Desarrollar la capacidad de análisis lógico del aprendiz mediante la construcción de algoritmos sencillos en Python, aplicando variables, operadores, estructuras condicionales y ciclos, hasta integrarlos en la solución de un problema más completo.
        </p>
      </div>
      </Reveal>
    </div>
  );
}

// ─── Topic Header ─────────────────────────────────────────────────────────────

function TopicHeader({ topicId }: { topicId: string }) {
  const T = useT();
  const cat = useCat();
  const ctx = TOPIC_CONTEXT[topicId];
  if (!ctx) return null;
  return (
    <div className="card-elevated rounded-2xl border p-5 sm:p-6 space-y-5" style={{ borderColor: T.border, background: T.surface }}>
      <div>
        <div className="text-xs font-mono mb-1" style={{ color: T.subtle, fontFamily: "'JetBrains Mono', monospace" }}>
          {ctx.subtitle}
        </div>
        <h2 className="text-xl font-bold" style={{ color: T.text }}>{TOPIC_DATA[topicId]?.title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl p-4 space-y-1" style={{ background: T.surface2 }}>
          <div className="text-xs font-mono font-semibold mb-2" style={{ color: T.pyBlue, fontFamily: "'JetBrains Mono', monospace" }}>¿QUÉ SE APRENDE?</div>
          <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{ctx.what}</p>
        </div>
        <div className="rounded-xl p-4 space-y-1" style={{ background: T.surface2 }}>
          <div className="text-xs font-mono font-semibold mb-2" style={{ color: T.pyYellow, fontFamily: "'JetBrains Mono', monospace" }}>¿POR QUÉ ES IMPORTANTE?</div>
          <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{ctx.why}</p>
        </div>
      </div>
      <div>
        <div className="text-xs font-mono mb-2" style={{ color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>CONCEPTOS CLAVE</div>
        <div className="flex flex-wrap gap-2">
          {ctx.concepts.map((c) => {
            const cc = cat(c.color);
            return (
            <div key={c.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs max-w-full" style={{ background: T.bg, border: `1px solid ${cc}30` }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cc }} />
              <span className="font-semibold flex-shrink-0" style={{ color: cc }}>{c.label}</span>
              <span className="text-xs hidden sm:inline truncate" style={{ color: T.subtle }}>— {c.desc}</span>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

// ─── Code Renderer ───────────────────────────────────────────────────────────

const PY_KEYWORDS = new Set([
  "if", "elif", "else", "for", "while", "in", "and", "or", "not", "True", "False",
  "None", "return", "def", "class", "import", "from", "as", "pass", "break",
  "continue", "range", "try", "except", "finally", "raise", "with", "lambda",
]);
const PY_BUILTINS = new Set([
  "print", "input", "int", "float", "str", "bool", "len", "round", "abs", "type",
  "sum", "min", "max", "open", "list", "dict", "set", "tuple", "sorted",
]);

const escHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Resaltador de sintaxis por tokens. Recorre cada línea una sola vez y
 * escapa el HTML de cada token al envolverlo, de modo que el marcado
 * que se inserta nunca vuelve a analizarse (eso rompía líneas con `class`,
 * `<`, `>` o comillas dentro de cadenas).
 */
function highlightPython(code: string): string {
  const token =
    /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|#.*|\d[\d.]*|[A-Za-z_]\w*|[\s\S])/g;

  return code
    .split("\n")
    .map((line) => {
      let out = "";
      let m: RegExpExecArray | null;
      token.lastIndex = 0;
      while ((m = token.exec(line)) !== null) {
        const t = m[0];
        if (t[0] === '"' || t[0] === "'") out += `<span class="string">${escHtml(t)}</span>`;
        else if (t[0] === "#") out += `<span class="comment">${escHtml(t)}</span>`;
        else if (/^\d/.test(t)) out += `<span class="number">${escHtml(t)}</span>`;
        else if (PY_KEYWORDS.has(t)) out += `<span class="keyword">${t}</span>`;
        else if (PY_BUILTINS.has(t)) out += `<span class="builtin">${t}</span>`;
        else out += escHtml(t);
      }
      return out;
    })
    .join("\n");
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const T = useT();

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlighted = highlightPython(code);

  return (
    <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: T.border, background: T.codeBg }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: T.border, background: T.codeBar }}>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <button
          onClick={copyCode}
          className="text-xs px-3 py-1 rounded transition-all cursor-pointer"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: copied ? T.accent : T.subtle,
            background: copied ? T.accentBg : "transparent",
          }}
        >
          {copied ? "✓ copiado" : "copiar"}
        </button>
      </div>
      <pre
        className="code-block p-4 overflow-x-auto"
        style={{ margin: 0, tabSize: 4 }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}

// ─── Exercise Card ────────────────────────────────────────────────────────────

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const [expanded, setExpanded] = useState(true);
  const T = useT();

  return (
    <div
      className="card-elevated rounded-xl border overflow-hidden transition-all"
      style={{ borderColor: expanded ? tint(T.accent, 27) : T.border, background: T.surface }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-center gap-3 cursor-pointer transition-colors"
        style={{ background: expanded ? T.accentBg : "transparent" }}
        onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = "var(--surface2)"; }}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = "transparent"; }}
      >
        <span
          className="text-xs font-mono font-semibold w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: tint(T.accent, 13), color: T.accent, fontFamily: "'JetBrains Mono', monospace" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-semibold text-sm flex-1" style={{ color: T.text }}>
          {exercise.title}
        </span>
        <span
          className="text-xs transition-transform duration-200"
          style={{ color: T.subtle, transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>

      <div className={`exercise-body${expanded ? " open" : ""}`} aria-hidden={!expanded}>
        <div className="exercise-body-inner">
          <div className="px-5 pb-5 space-y-4">
            <p className="text-sm" style={{ color: T.subtle }}>
              {exercise.description}
            </p>
            <CodeBlock code={exercise.code} />
            {(exercise.input || exercise.output) && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {exercise.input && (
                  <div className="rounded-lg px-4 py-3" style={{ background: T.surface2 }}>
                    <div className="text-xs font-mono mb-1" style={{ color: T.pyBlue, fontFamily: "'JetBrains Mono', monospace" }}>
                      ENTRADA
                    </div>
                    <div className="text-sm font-mono" style={{ color: T.text, fontFamily: "'JetBrains Mono', monospace" }}>
                      {exercise.input}
                    </div>
                  </div>
                )}
                {exercise.output && (
                  <div className="rounded-lg px-4 py-3" style={{ background: T.surface2 }}>
                    <div className="text-xs font-mono mb-1" style={{ color: T.accent, fontFamily: "'JetBrains Mono', monospace" }}>
                      SALIDA
                    </div>
                    <div className="text-sm font-mono" style={{ color: T.text, fontFamily: "'JetBrains Mono', monospace" }}>
                      {exercise.output}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Workshop Card ────────────────────────────────────────────────────────────

function WorkshopSection({ items, topicNum, topicId }: { items: string[]; topicNum: number; topicId: string }) {
  const T = useT();
  const [done, setDone] = useState<Set<number>>(() => new Set(readDone(topicId)));

  if (!items.length) return null;

  const toggle = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      try {
        localStorage.setItem(`elipy-taller-${topicId}`, JSON.stringify([...next]));
      } catch {
        /* almacenamiento no disponible */
      }
      window.dispatchEvent(new Event(PROGRESS_EVENT));
      return next;
    });
  };

  return (
    <div className="card-elevated rounded-xl p-4 sm:p-5 space-y-4" style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `4px solid ${T.pyYellow}` }}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span
          className="text-xs font-mono px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
          style={{ background: tint(T.pyYellow, 13), color: T.pyYellow, fontFamily: "'JetBrains Mono', monospace" }}
        >
          TALLER {topicNum}
        </span>
        <span className="text-sm font-semibold" style={{ color: T.text }}>
          Ejercicios para resolver
        </span>
        <span className="ml-auto text-xs flex-shrink-0" style={{ color: T.subtle }}>
          {done.size}/{items.length} completados
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full" style={{ background: T.surface2 }}>
        <div
          className="h-1 rounded-full transition-all duration-500"
          style={{ width: `${(done.size / items.length) * 100}%`, background: T.pyYellow }}
        />
      </div>

      <div className="space-y-3">
        {items.map((item, i) => {
          const lines = item.split("\n").map((l) => l.trim()).filter(Boolean);
          const intro = lines.filter((l) => !l.startsWith("- ")).join(" ");
          const bullets = lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
          return (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer"
            style={{ background: done.has(i) ? tint(T.pyYellow, 7) : "transparent" }}
          >
            <span
              className="mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center text-xs transition-all"
              style={{
                borderColor: done.has(i) ? T.pyYellow : T.border2,
                background: done.has(i) ? T.pyYellow : "transparent",
                color: T.bg,
              }}
            >
              {done.has(i) ? "✓" : ""}
            </span>
            <span
              className="text-sm"
              style={{ color: done.has(i) ? T.subtle : T.text2, textDecoration: done.has(i) ? "line-through" : "none" }}
            >
              <span className="font-mono text-xs mr-2" style={{ color: T.pyYellow, fontFamily: "'JetBrains Mono', monospace" }}>
                {i + 1}.
              </span>
              {intro}
              {bullets.length > 0 && (
                <ul className="mt-2 ml-1 space-y-1 list-disc list-inside" style={{ textDecoration: "inherit" }}>
                  {bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              )}
            </span>
          </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTopic, setActiveTopic] = useState("home");
  const [light, setLight] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("elipy-tema");
      if (saved === "light") return true;
      if (saved === "dark") return false;
    } catch {
      /* sin almacenamiento */
    }
    try {
      return window.matchMedia("(prefers-color-scheme: light)").matches;
    } catch {
      return false;
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem("elipy-nombre") ?? "";
    } catch {
      return "";
    }
  });
  const [scrollPct, setScrollPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  const totalWorkshopItems = TALLER_TOPICS.reduce(
    (n, id) => n + (TOPIC_DATA[id]?.workshop.items.length ?? 0),
    0,
  );
  const progressPct =
    totalWorkshopItems > 0 ? Math.min(100, Math.round((doneCount / totalWorkshopItems) * 100)) : 0;

  const saveName = (n: string) => {
    setUserName(n);
    try {
      localStorage.setItem("elipy-nombre", n);
    } catch {
      /* almacenamiento no disponible (modo privado) */
    }
  };

  const toggleLight = () => {
    setLight((v) => {
      const next = !v;
      try {
        localStorage.setItem("elipy-tema", next ? "light" : "dark");
      } catch {
        /* sin almacenamiento */
      }
      return next;
    });
  };

  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

  // El menú sigue el tamaño de pantalla: cerrado en móvil (overlay),
  // abierto en escritorio. Se reajusta al redimensionar / girar el dispositivo.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setSidebarOpen(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Al cambiar de sección, volver siempre al inicio del contenido.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activeTopic]);

  // Barra de progreso de lectura (scroll del contenido).
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollPct(max > 4 ? (el.scrollTop / max) * 100 : 0);
      setShowTop(el.scrollTop > 500);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeTopic]);

  // Progreso global del taller (suma de ejercicios marcados).
  useEffect(() => {
    const recompute = () => {
      let c = 0;
      for (const id of TALLER_TOPICS) c += readDone(id).length;
      setDoneCount(c);
    };
    recompute();
    window.addEventListener(PROGRESS_EVENT, recompute);
    window.addEventListener("storage", recompute);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, recompute);
      window.removeEventListener("storage", recompute);
    };
  }, []);

  const navigate = (id: string) => {
    setActiveTopic(id);
    if (isMobile()) setSidebarOpen(false);
  };

  const topic = TOPIC_DATA[activeTopic] ?? null;
  const topicNum = activeTopic === "tema1" ? 1 : activeTopic === "tema2" ? 2 : activeTopic === "tema3" ? 3 : activeTopic === "tema4" ? 4 : 0;
  const topicOrder = TOPICS.map((t) => t.id);
  const nextTopicIdx = topicOrder.indexOf(activeTopic);
  const nextTopic = nextTopicIdx >= 0 && nextTopicIdx < TOPICS.length - 1 ? TOPICS[nextTopicIdx + 1] : null;

  const T = {
    bg:       "var(--bg)",
    surface:  "var(--surface)",
    surface2: "var(--surface2)",
    border:   "var(--border)",
    border2:  "var(--border2)",
    text:     "var(--text)",
    text2:    "var(--text2)",
    muted:    "var(--muted)",
    subtle:   "var(--subtle)",
    faint:    "var(--faint)",
    accent:   "var(--accent)",
    accentBg: "var(--accent-bg)",
    pyBlue:   "var(--py-blue)",
    pyBlue2:  "var(--py-blue2)",
    pyYellow: "var(--py-yellow)",
    codeBg:   "var(--code-bg)",
    codeBar:  "var(--code-bar)",
  };

  return (
    <ThemeCtx.Provider value={T}>
    <LightCtx.Provider value={light}>
    <div className={`flex h-full relative${light ? " light" : ""}`} style={{ background: T.bg, color: T.text }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className="app-sidebar flex-shrink-0 flex flex-col overflow-hidden"
        style={{
          width: sidebarOpen ? 256 : 0,
          minWidth: sidebarOpen ? 256 : 0,
          borderRight: `1px solid ${T.border}`,
          background: T.surface,
          transition: "width 0.28s cubic-bezier(0.16,1,0.3,1), min-width 0.28s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: light ? "2px 0 12px rgba(15,23,42,0.05)" : "none",
        }}
      >
        <div style={{ width: 256, minWidth: 256, display: "flex", flexDirection: "column", height: "100%" }}>

          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 38, height: 38, background: `linear-gradient(135deg, #4B8BBE 0%, #306998 100%)` }}>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C11.6 4 9 6 9 9.5V13h7v1H7C4.8 14 3 15.8 3 18.5c0 2.8 1.8 4.5 4 4.5h2v-3.5C9 17 10.8 15 13 15h6c2 0 3.5-1.5 3.5-3.5V9.5C22.5 6 20 4 16 4zm-1.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="white" fillOpacity="0.9"/>
                <path d="M16 28c4.4 0 7-2 7-5.5V19h-7v-1h8C26.2 18 28 16.2 28 13.5 28 10.7 26.2 9 24 9h-2v3.5C22 14.8 20.2 17 18 17h-6c-2 0-3.5 1.5-3.5 3.5v5.5C8.5 29.5 11.6 28 16 28zm1.5-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="#FFE873"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-base leading-tight" style={{ color: T.text, letterSpacing: "-0.02em" }}>
                Eli<span style={{ color: T.pyBlue }}>.Py</span>
              </div>
       
            </div>
          </div>

          {/* Module pill */}
          <div className="px-4 mb-2">
            <div className="rounded-lg px-3 py-2.5" >

              <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: light ? "rgba(15,23,42,0.10)" : "rgba(255,255,255,0.10)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${progressPct}%`, background: T.accent, transition: "width 0.5s cubic-bezier(0.22,0.7,0.3,1)" }}
                />
              </div>
              <div className="text-xs mt-1.5" style={{ color: T.subtle }}>
                
              </div>
            </div>
          </div>

          <div className="px-4 mb-1">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: T.faint, letterSpacing: "0.1em" }}>Contenido</div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 overflow-y-auto">
            {TOPICS.map((t) => {
              const isActive = activeTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => navigate(t.id)}
                  className={`nav-item w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 cursor-pointer text-sm group${isActive ? " active" : ""}`}
                >
                  <span
                    className="flex items-center justify-center rounded-lg text-sm flex-shrink-0"
                    style={{
                      width: 28, height: 28,
                      background: isActive ? "rgba(255,255,255,0.2)" : T.surface2,
                    }}
                  >
                    {t.icon}
                  </span>
                  <span className="truncate">{t.label}</span>
                  {isActive && (
                    <svg className="ml-auto flex-shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer user card */}
          <div className="mx-3 mb-3 mt-2 rounded-xl p-3 flex items-center gap-3" style={{ background: T.surface2, border: `1px solid ${T.border}` }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${T.pyBlue} 0%, ${T.pyBlue2} 100%)`, color: "#fff" }}
            >
              L
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: T.text }}>Luz Eliana Martínez</div>
              <a
                href="https://github.com/EMARTINEZ1993"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs truncate block transition-colors"
                style={{ color: T.subtle, textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = T.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = T.subtle)}
              >
                @EMARTINEZ1993
              </a>
            </div>
            <span className="text-xs flex-shrink-0" style={{ color: T.faint }}>© 26</span>
          </div>
        </div>
      </aside>

      {/* Fondo oscuro al abrir el menú en móvil */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main ────────────────────────────────────────────── */}
      <main ref={mainRef} className="flex-1 overflow-y-auto flex flex-col min-w-0">

        {/* Topbar */}
        <div
          className="sticky top-0 z-20 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 border-b"
          style={{
            borderColor: T.border,
            background: light ? "rgba(255,255,255,0.92)" : "rgba(13,17,23,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Progreso de lectura */}
          <div
            className="absolute left-0 bottom-0 h-0.5 pointer-events-none"
            style={{
              width: `${scrollPct}%`,
              background: T.accent,
              opacity: scrollPct > 0.5 ? 1 : 0,
              transition: "width 0.1s linear, opacity 0.2s ease",
            }}
          />
          {/* Toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center rounded-xl cursor-pointer transition-all flex-shrink-0"
            style={{ width: 36, height: 36, background: T.surface2, border: `1px solid ${T.border}`, color: T.subtle }}
            title={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3.5" width="12" height="1.5" rx="0.75" fill="currentColor"/>
              <rect x="2" y="7.25" width="9" height="1.5" rx="0.75" fill="currentColor"/>
              <rect x="2" y="11" width="12" height="1.5" rx="0.75" fill="currentColor"/>
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm flex-shrink-0" style={{ color: T.faint }}>
              {TOPICS.find(t => t.id === activeTopic)?.icon}
            </span>
            <span className="text-sm font-medium truncate" style={{ color: T.muted }}>
              {TOPICS.find(t => t.id === activeTopic)?.label}
            </span>
            {activeTopic !== "home" && topic?.title && (
              <span className="hidden md:flex items-center gap-2 min-w-0">
                <span className="flex-shrink-0" style={{ color: T.faint }}>/</span>
                <span className="text-sm font-semibold truncate" style={{ color: T.text }}>
                  {topic.title}
                </span>
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {userName && (
              <button
                onClick={() => navigate("home")}
                className="flex items-center gap-2 pl-1 pr-1 sm:pr-2.5 py-1 rounded-full cursor-pointer transition-all flex-shrink-0"
                style={{ background: T.surface2, border: `1px solid ${T.border}` }}
                title="Ir al inicio"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${T.pyBlue}, ${T.pyBlue2})`, color: "#fff" }}
                >
                  {userName.trim().charAt(0).toUpperCase()}
                </span>
                <span className="text-xs font-semibold hidden sm:block truncate" style={{ color: T.text, maxWidth: 120 }}>
                  {userName.split(" ")[0]}
                </span>
              </button>
            )}

            <button
              onClick={toggleLight}
              className="flex items-center justify-center rounded-xl cursor-pointer transition-all"
              style={{ width: 36, height: 36, background: T.surface2, border: `1px solid ${T.border}`, color: T.muted, fontSize: "1rem" }}
              title={light ? "Tema oscuro" : "Tema claro"}
            >
              {light ? "🌙" : "☀️"}
            </button>
          </div>
        </div>

        {/* Home page */}
        {activeTopic === "home" && (
          <div key="home" className="page-enter">
            <HomePage onNavigate={navigate} userName={userName} onSetName={saveName} />
          </div>
        )}

        {/* Requirements page */}
        {activeTopic === "requisitos" && (
          <div key="requisitos" className="page-enter">
            <RequirementsPage />
          </div>
        )}

        {/* Topic content */}
        {activeTopic !== "home" && activeTopic !== "requisitos" && topic && (
        <div key={activeTopic} className="page-enter px-4 sm:px-8 py-8 max-w-4xl mx-auto space-y-8">
          {/* Topic header with context */}
          <TopicHeader topicId={activeTopic} />

          {/* Exercises header */}
          {topic.exercises.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1" style={{ background: T.border }} />
                <span
                  className="text-xs font-mono px-3 py-1 rounded-full"
                  style={{ fontFamily: "'JetBrains Mono', monospace", background: T.accentBg, color: T.accent }}
                >
                  EJERCICIOS RESUELTOS
                </span>
                <div className="h-px flex-1" style={{ background: T.border }} />
              </div>
              <div className="space-y-3">
                {topic.exercises.map((ex, i) => (
                  <ExerciseCard key={ex.id} exercise={ex} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Workshop */}
          {topic.workshop.items.length > 0 && (
            <WorkshopSection items={topic.workshop.items} topicNum={topicNum} topicId={activeTopic} />
          )}

          {/* Deliverables for integrator */}
          {activeTopic === "integrador" && (
            <div className="rounded-xl border p-5 space-y-3" style={{ borderColor: tint(T.pyBlue, 27), background: T.surface }}>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full inline-block"
                style={{ background: tint(T.pyBlue, 13), color: T.pyBlue, fontFamily: "'JetBrains Mono', monospace" }}>
                ENTREGABLES
              </span>
              {[
                "Archivos .py con el código fuente de los ejercicios resueltos en los Talleres 1, 2 y 3.",
                "Archivo .py con la solución del ejercicio integrador final.",
                "Evidencia de las pruebas realizadas (capturas de consola con los resultados de cada programa).",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm" style={{ color: T.text2 }}>
                  <span className="font-mono text-xs mt-0.5" style={{ color: T.pyBlue, fontFamily: "'JetBrains Mono', monospace" }}>→</span>
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* Requirements */}
          {activeTopic === "integrador" && (
            <div className="rounded-xl border p-5" style={{ borderColor: T.border, background: T.surface }}>
              <div className="text-sm font-semibold mb-3" style={{ color: T.text }}>Requisitos Técnicos</div>
              <div className="space-y-2">
                {[
                  "Python 3.x instalado",
                  "Editor de código: Visual Studio Code",
                  "Conocimientos de variables, tipos de datos, operadores, condicionales y ciclos",
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" style={{ color: T.muted }}>
                    <span style={{ color: T.accent }}>•</span>
                    {req}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions for all topics */}
          {activeTopic === "intro" && (
            <div className="rounded-xl border p-5 space-y-3" style={{ borderColor: tint(T.pyBlue, 27), background: T.surface }}>
              <div className="text-xs font-mono mb-1" style={{ color: T.pyBlue, fontFamily: "'JetBrains Mono', monospace" }}>
                INSTRUCCIONES GENERALES
              </div>
              {[
                "Revisar los ejercicios resueltos de cada tema antes de intentar el taller.",
                "Todos los ejercicios del taller deben solicitar datos al usuario mediante input().",
                "Mostrar los resultados en pantalla con print() y comentar el código.",
                "Probar cada programa con distintos valores de entrada para validar su funcionamiento.",
                "El ejercicio integrador combina condicionales y ciclos en una sola solución.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm" style={{ color: T.text2 }}>
                  <span className="font-mono text-xs w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: tint(T.pyBlue, 13), color: T.pyBlue, fontFamily: "'JetBrains Mono', monospace" }}>
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Siguiente módulo */}
        {activeTopic !== "home" && nextTopic && (
          <div className="px-4 sm:px-8 max-w-4xl mx-auto pb-8">
            <button
              onClick={() => navigate(nextTopic.id)}
              className="nav-item w-full flex items-center justify-between gap-3 rounded-xl border px-5 py-4 cursor-pointer"
              style={{ borderColor: T.border, background: T.surface }}
            >
              <span className="text-xs font-mono" style={{ color: T.subtle, fontFamily: "'JetBrains Mono', monospace" }}>
                SIGUIENTE
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: T.text }}>
                <span>{nextTopic.icon}</span>
                <span>{nextTopic.label}</span>
                <span style={{ color: T.accent }}>→</span>
              </span>
            </button>
          </div>
        )}

        {/* Volver arriba */}
        <button
          onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Volver arriba"
          title="Volver arriba"
          className="fixed bottom-5 right-5 z-30 flex items-center justify-center rounded-full cursor-pointer"
          style={{
            width: 40,
            height: 40,
            background: T.surface,
            border: `1px solid ${T.border}`,
            color: T.muted,
            boxShadow: light ? "0 4px 14px rgba(15,23,42,0.12)" : "0 4px 14px rgba(0,0,0,0.4)",
            opacity: showTop ? 1 : 0,
            transform: showTop ? "translateY(0)" : "translateY(8px)",
            pointerEvents: showTop ? "auto" : "none",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </main>
    </div>
    </LightCtx.Provider>
    </ThemeCtx.Provider>
  );
}
