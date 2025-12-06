
package main;

import model.Поїзд;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;
import java.util.stream.Collectors;

/**
 * Головний клас програми. Відповідає за взаємодію з користувачем,
 * роботу з файлами та виклик методів для пошуку та сортування даних про поїзди.
 * @version 1.2
 */
public class Головний {

    /** Шлях до файлу, де зберігаються дані про поїзди. Використовується як константа. */
    private static final String ШЛЯХ_ДО_ФАЙЛУ = "data/trains.csv";

    /** Форматер для парсингу та форматування часу у вигляді "HH:mm". Використовується як константа. */
    private static final DateTimeFormatter ФОРМАТЕР_ЧАСУ = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Точка входу в програму. Запускає нескінченний цикл з головним меню,
     * який керує всією логікою програми до моменту вибору виходу.
     * @param args Аргументи командного рядка (в цій програмі не використовуються).
     */
    public static void main(String[] args) {
        // Першим ділом, перевіряємо і, якщо треба, створюємо файл з даними
        створитиПочатковийФайлЯкщоПотрібно();

        Scanner сканер = new Scanner(System.in);
        while (true) {
            вивестиМеню();
            System.out.print("Ваш вибір: ");
            String вибір = сканер.nextLine();

            // Перед кожною операцією зчитуємо актуальний список з файлу
            List<Поїзд> поїзди = завантажитиПоїздиЗФайлу();

            // Обробляємо вибір користувача
            switch (вибір) {
                case "1": пошукЗаПунктомПризначення(поїзди, сканер); break;
                case "2": пошукЗаПунктомІЧасом(поїзди, сканер); break;
                case "3": пошукЗаПунктомТаНаявністюЗагальнихМісць(поїзди, сканер); break;
                case "4": додатиНовийПоїзд(сканер); break;
                case "5": вивестиВсіПоїзди(поїзди); break;
                case "0": System.out.println("Завершення роботи програми."); return; // Вихід з програми
                default: System.out.println("Невірний вибір. Спробуйте ще раз.");
            }
            System.out.println("\nНатисніть Enter для продовження...");
            сканер.nextLine(); // Пауза, щоб користувач встиг прочитати результат
        }
    }

    /**
     * Друкує на консоль головне меню з доступними опціями.
     */
    private static void вивестиМеню() {
        System.out.println("\n===== МЕНЮ КЕРУВАННЯ ПОЇЗДАМИ =====");
        System.out.println("1. Список поїздів до заданого пункту призначення");
        System.out.println("2. Список поїздів до пункту призначення, що відправляються після заданої години");
        System.out.println("3. Список поїздів до пункту призначення, що мають загальні місця");
        System.out.println("4. Додати новий поїзд у файл");
        System.out.println("5. Показати всі поїзди");
        System.out.println("0. Вихід");
    }

    // --- МЕТОДИ ПОШУКУ ---

    /**
     * Виконує пошук поїздів за вказаним пунктом призначення.
     * @param поїзди Список усіх поїздів, серед яких виконується пошук.
     * @param сканер Об'єкт Scanner для зчитування вводу користувача (пункту призначення).
     */
    public static void пошукЗаПунктомПризначення(List<Поїзд> поїзди, Scanner сканер) {
        System.out.print("Введіть пункт призначення: ");
        String пункт = сканер.nextLine();

        // Використання Stream API для фільтрації списку
        List<Поїзд> результати = поїзди.stream()
                .filter(p -> p.отриматиПунктПризначення().equalsIgnoreCase(пункт))
                .collect(Collectors.toList());

        вивестиРезультатиПошуку(результати, "Поїзди до пункту '" + пункт + "':");
    }

    /**
     * Виконує пошук поїздів до заданого пункту призначення, що відправляються після вказаного часу.
     * @param поїзди Список усіх поїздів для пошуку.
     * @param сканер Об'єкт Scanner для зчитування вводу користувача.
     */
    public static void пошукЗаПунктомІЧасом(List<Поїзд> поїзди, Scanner сканер) {
        System.out.print("Введіть пункт призначення: ");
        String пункт = сканер.nextLine();
        LocalTime час = null;
        String часВводу = "";

        // Цикл для валідації вводу часу
        while (час == null) {
            System.out.print("Введіть час у форматі HH:mm (напр. 18:30): ");
            часВводу = сканер.nextLine();
            try {
                час = LocalTime.parse(часВводу, ФОРМАТЕР_ЧАСУ);
            } catch (DateTimeParseException e) {
                System.out.println("Помилка! Неправильний формат часу. Спробуйте ще раз.");
            }
        }

        final LocalTime кінцевийЧас = час; // Необхідно для використання в лямбда-виразі
        List<Поїзд> результати = поїзди.stream()
                .filter(p -> p.отриматиПунктПризначення().equalsIgnoreCase(пункт) &&
                        p.отриматиЧасВідправки().isAfter(кінцевийЧас))
                .collect(Collectors.toList());

        вивестиРезультатиПошуку(результати, "Поїзди до '" + пункт + "' після " + часВводу + ":");
    }

    /**
     * Виконує пошук поїздів до заданого пункту призначення, які мають вільні загальні місця.
     * @param поїзди Список усіх поїздів для пошуку.
     * @param сканер Об'єкт Scanner для зчитування вводу користувача.
     */
    public static void пошукЗаПунктомТаНаявністюЗагальнихМісць(List<Поїзд> поїзди, Scanner сканер) {
        System.out.print("Введіть пункт призначення: ");
        String пункт = сканер.nextLine();

        List<Поїзд> результати = поїзди.stream()
                .filter(p -> p.отриматиПунктПризначення().equalsIgnoreCase(пункт) &&
                        p.отриматиКількістьЗагальнихМісць() > 0)
                .collect(Collectors.toList());

        вивестиРезультатиПошуку(результати, "Поїзди до '" + пункт + "', що мають загальні місця:");
    }

    /**
     * Виводить на консоль повний список поїздів без фільтрації.
     * @param поїзди Список усіх поїздів, який потрібно вивести.
     */
    public static void вивестиВсіПоїзди(List<Поїзд> поїзди) {
        вивестиРезультатиПошуку(поїзди, "Повний розклад поїздів:");
    }

    // --- МЕТОДИ ДЛЯ РОБОТИ З ФАЙЛОМ ---

    /**
     * Завантажує список поїздів з файлу CSV. Обробляє можливі помилки читання файлу
     * та парсингу даних.
     * @return Повертає список об'єктів {@link Поїзд}, прочитаних з файлу. Якщо файл порожній або
     * сталася помилка, повертає порожній список.
     */
    private static List<Поїзд> завантажитиПоїздиЗФайлу() {
        List<Поїзд> поїзди = new ArrayList<>();
        try {
            List<String> рядки = Files.readAllLines(Paths.get(ШЛЯХ_ДО_ФАЙЛУ));
            for (String рядок : рядки) {
                String[] дані = рядок.split(";");
                if (дані.length == 7) {
                    поїзди.add(new Поїзд(
                            дані[0],
                            дані[1],
                            LocalTime.parse(дані[2], ФОРМАТЕР_ЧАСУ),
                            Integer.parseInt(дані[3]),
                            Integer.parseInt(дані[4]),
                            Integer.parseInt(дані[5]),
                            Integer.parseInt(дані[6])
                    ));
                }
            }
        } catch (IOException | DateTimeParseException | NumberFormatException e) {
            System.err.println("Помилка при читанні файлу: " + e.getMessage());
        }
        return поїзди;
    }

    /**
     * Запитує у користувача дані про новий поїзд та додає його у кінець файлу.
     * @param сканер Об'єкт Scanner для зчитування вводу користувача.
     */
    private static void додатиНовийПоїзд(Scanner сканер) {
        try {
            System.out.print("Введіть пункт призначення: ");
            String пункт = сканер.nextLine();
            System.out.print("Введіть номер поїзда: ");
            String номер = сканер.nextLine();
            System.out.print("Введіть час відправки (HH:mm): ");
            LocalTime час = LocalTime.parse(сканер.nextLine(), ФОРМАТЕР_ЧАСУ);
            System.out.print("Введіть кількість загальних місць: ");
            int заг = Integer.parseInt(сканер.nextLine());
            System.out.print("Введіть кількість купе місць: ");
            int купе = Integer.parseInt(сканер.nextLine());
            System.out.print("Введіть кількість плацкарт місць: ");
            int плац = Integer.parseInt(сканер.nextLine());
            System.out.print("Введіть кількість люкс місць: ");
            int люкс = Integer.parseInt(сканер.nextLine());

            Поїзд новийПоїзд = new Поїзд(пункт, номер, час, заг, купе, плац, люкс);

            // Додаємо новий рядок у кінець файлу
            String рядокДляЗапису = новийПоїзд.вРядокДляФайлу() + System.lineSeparator();
            Files.writeString(Paths.get(ШЛЯХ_ДО_ФАЙЛУ), рядокДляЗапису, StandardOpenOption.APPEND);

            System.out.println("✓ Новий поїзд успішно додано до файлу!");

        } catch (Exception e) {
            System.err.println("Помилка при додаванні поїзда: " + e.getMessage() + ". Перевірте введені дані.");
        }
    }

    /**
     * Створює початковий CSV-файл з 50 згенерованими записами,
     * якщо він ще не існує. Це забезпечує наявність даних при першому запуску програми.
     */
    private static void створитиПочатковийФайлЯкщоПотрібно() {
        Path шляхДоФайлу = Paths.get(ШЛЯХ_ДО_ФАЙЛУ);
        if (Files.exists(шляхДоФайлу)) {
            return; // Файл вже існує, нічого не робимо
        }

        System.out.println("Створення початкового файлу з даними...");
        try {
            // Створюємо директорію data, якщо її немає
            Files.createDirectories(шляхДоФайлу.getParent());

            List<String> рядки = new ArrayList<>();
            String[] міста = {"Київ", "Львів", "Одеса", "Харків", "Дніпро", "Запоріжжя", "Івано-Франківськ", "Ужгород"};
            Random rand = new Random();

            for (int i = 0; i < 50; i++) {
                String пункт = міста[rand.nextInt(міста.length)];
                String номер = (100 + rand.nextInt(900)) + "К";
                LocalTime час = LocalTime.of(rand.nextInt(24), rand.nextInt(60));
                int заг = rand.nextBoolean() ? rand.nextInt(100) : 0; // Загальні місця є не завжди
                int купе = 20 + rand.nextInt(80);
                int плац = 50 + rand.nextInt(150);
                int люкс = 10 + rand.nextInt(20);

                Поїзд поїзд = new Поїзд(пункт, номер, час, заг, купе, плац, люкс);
                рядки.add(поїзд.вРядокДляФайлу());
            }

            Files.write(шляхДоФайлу, рядки);
            System.out.println("✓ Файл " + ШЛЯХ_ДО_ФАЙЛУ + " успішно створено з 50 записами.");

        } catch (IOException e) {
            System.err.println("Не вдалося створити початковий файл: " + e.getMessage());
        }
    }

    // --- ДОПОМІЖНИЙ МЕТОД ВИВОДУ ---

    /**
     * Допоміжний метод для форматованого виводу результатів пошуку на консоль.
     * @param результати Список поїздів, який потрібно вивести.
     * @param заголовок Текст, що буде відображатися над списком результатів.
     */
    private static void вивестиРезультатиПошуку(List<Поїзд> результати, String заголовок) {
        System.out.println("\n--- " + заголовок + " ---");
        if (результати.isEmpty()) {
            System.out.println("Поїздів за вашим критерієм не знайдено.");
        } else {
            результати.forEach(System.out::println);
        }
        System.out.println("-------------------------------------");
    }
}
